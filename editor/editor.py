import math
import json
import tkinter as tk
import subprocess
import random
from tkinter import filedialog
from PIL import ImageTk, Image, ImageDraw
from enum import Enum

TileType = {
    0 : "EMPTY",
    1 : "SOLID",
    #Slopes named after which side is the low side
    2 : "SLOPE_DOWN",
    3 : "SLOPE_UP",
    4 : "SLOPE_LEFT",
    5 : "SLOPE_RIGHT",
}

TypeTile = {v: k for k, v in TileType.items()}

# Seed the RNG
random.seed(9)
def getcolor():
    return random.randint(0,255)


TileColor = {x: '#%02X%02X%02X' % (getcolor(),getcolor(),getcolor())
             for x in range(0, 256)}

class Application(tk.Frame):
    def __init__(self, master=None):
        tk.Frame.__init__(self, master)
        self.master = master
        self.pack()

        self.__select = 0

        self.tiles = Image.open("../images/tiles.png")
        self.tiles = self.tiles.resize(
                (self.tiles.width * 2, self.tiles.height * 2),
                Image.NEAREST)
        self.tileset = self._getTileset(self.tiles, 32)
        self.tilesetTk = [ImageTk.PhotoImage(x) for x in self.tileset]
        self.tilesTk = ImageTk.PhotoImage(self.tiles)
        self.createWidgets()
        
        self.roomset = RoomList(self.tileset)
        self.currenti = 0
        self.room = self.roomset.getroom(0)
        self.layer = 0

        self.drawroom()

    def _getTileset(self, tiles, size):
        return [tiles.crop((x*size,0,(x+1)*size,size)) for x in
                range(0, int(self.tiles.width // size))]

    def createWidgets(self):
        self.master.bind("<Left>", lambda x: self.moveset(-1))
        self.master.bind("<Right>", lambda x: self.moveset(1))
        self.master.bind("<Delete>", self.delroom)
        
        commandbar = tk.Frame(self)
        commandbar.grid(row=0, column=1)
        loadbutton = tk.Button(commandbar, text="Open", command=self.open)
        loadbutton.grid(row=0, column=0)
        savebutton = tk.Button(commandbar, text="Save", command=self.save)
        savebutton.grid(row=0, column=1)
        imagebutton = tk.Button(
            commandbar, text="Update images", command=
            lambda: subprocess.Popen(
                ["python3", "process.py"], cwd="../images/process/"))
        imagebutton.grid(row=0, column=2)
        dumpmapbutton = tk.Button(
            commandbar, text="Dump map", command=
            lambda: self.roomset.drawgrid().save("map.png"))
        dumpmapbutton.grid(row=0, column=3)
       
        scrolltilecanvas = tk.Scrollbar(self, orient=tk.HORIZONTAL)
        scrolltilecanvas.grid(row=2, column=0, columnspan=4, sticky=tk.W+tk.E)
        self.tilecanvas = tk.Canvas(self, 
                                    scrollregion=(0,0,self.tiles.width,
                                                  self.tiles.height),
                                    height=self.tiles.height,
                                    xscrollcommand=scrolltilecanvas.set)
        self.tilecanvasimg = self.tilecanvas.create_image(
                0,0,anchor=tk.NW,image=self.tilesTk)
        self.tilecanvas.grid(row=1, column=0, columnspan=4, sticky=tk.W+tk.E)
        self.tilecanvas.bind("<Button-1>", self.tileclick)
        self.tilecanvas.bind("<Motion>", self.tilemove)
        scrolltilecanvas.config(command=self.tilecanvas.xview)

        editpanel = tk.Frame(self)
        editpanel.grid(row=3, column=1)

        viewpanel = tk.Frame(editpanel)
        viewpanel.grid(row=0, column=0)
        viewxscroll = tk.Scrollbar(viewpanel, orient=tk.HORIZONTAL)
        viewyscroll = tk.Scrollbar(viewpanel)
        viewxscroll.grid(row=1, column=0, sticky=tk.W + tk.E)
        viewyscroll.grid(row=0, column=1, sticky=tk.N + tk.S)
        self.viewcanvas = tk.Canvas(
            viewpanel, height=10*32, width=10*32,
            scrollregion=(0, 0, 0, 0),
            xscrollcommand=viewxscroll.set,
            yscrollcommand=viewyscroll.set)
        self.viewcanvas.grid(row=0, column=0)
        self.viewcanvasimage = self.viewcanvas.create_image(0,0,anchor=tk.NW)
        viewxscroll.config(command=self.viewcanvas.xview)
        viewyscroll.config(command=self.viewcanvas.yview)

        self.viewcanvas.bind("<Button-1>", self.viewclick)
        self.viewcanvas.bind("<B1-Motion>", self.viewclick)
        self.viewcanvas.bind("<Motion>", self.viewmove)
        self.viewcanvas.bind("<Button-2>", self.cviewclick)
        self.viewcanvas.bind("<Button-3>", self.rviewclick)

        renderpanel = tk.Frame(editpanel)
        renderpanel.grid(row=0, column=1)
        renderxscroll = tk.Scrollbar(renderpanel, orient=tk.HORIZONTAL)
        renderyscroll = tk.Scrollbar(renderpanel)
        renderxscroll.grid(row=1, column=0, sticky=tk.W + tk.E)
        renderyscroll.grid(row=0, column=1, sticky=tk.N + tk.S)
        self.rendercanvas = tk.Canvas(
            renderpanel, width=10*32, height=10*32,
            xscrollcommand=renderxscroll.set,
            yscrollcommand=renderyscroll.set)
        self.rendercanvas.grid(row=0, column=0)
        self.rendercanvasimage = self.rendercanvas.create_image(0,0,anchor=tk.NW)
        renderxscroll.config(command=self.rendercanvas.xview)
        renderyscroll.config(command=self.rendercanvas.yview)

        self.objectview = []

        controls = tk.Frame(self)
        controls.grid(row=4, column=1, sticky=tk.W)

        self.objectlist = tk.Listbox(controls, width=32)
        self.objectlist.grid(row=0, column=0, columnspan=2)

        objfield = tk.Frame(controls, borderwidth=4, relief=tk.SUNKEN)
        objfield.grid(row=0, column=2, columnspan=2)
        self.arbitraryentry = tk.Entry(objfield, width=50)
        self.arbitraryentry.insert(0, "Insert function here")
        self.arbitraryentry.grid(row=1, column=0, columnspan=3)
        tk.Label(objfield, text="z: ").grid(row=2, column=0)
        self.lentry = tk.Entry(objfield, width=3)
        self.lentry.insert(0, "0")
        self.lentry.grid(row=2, column=1)
        tk.Label(objfield, text="x: ").grid(row=3, column=0)
        self.xentry = tk.Entry(objfield, width=3)
        self.xentry.insert(0, "0")
        self.xentry.grid(row=3, column=1)
        tk.Label(objfield, text="y: ").grid(row=4, column=0)
        self.yentry = tk.Entry(objfield, width=3)
        self.yentry.insert(0, "0")
        self.yentry.grid(row=4, column=1)
        addenemybutton = tk.Button(objfield, text="Add",
                                   command=self.addarbitrary )
        addenemybutton.grid(row=5, column=0, sticky=tk.W+tk.E, columnspan=2)
        
        delbutton = tk.Button(controls, text="Delete selection",
                                   command=self.deleteobj )
        delbutton.grid(row=1, column=0, sticky=tk.W+tk.E)

        delbutton = tk.Button(controls, text="Edit selection",
                                   command=self.editobj )
        delbutton.grid(row=1, column=1, sticky=tk.W+tk.E)
        


        sidepanel = tk.Frame(self)
        sidepanel.grid(row=3, column=3)

        levelpanel = tk.Frame(sidepanel, borderwidth=4, relief=tk.SUNKEN)
        levelpanel.pack()
        tk.Label(levelpanel, text="Level options").grid(row=0, column=0, columnspan=2)
        tk.Label(levelpanel, text="Width:").grid(row=1, column=0)
        self.levelwidth = tk.Spinbox(levelpanel, from_=5, to=100, width=3)
        self.levelwidth.grid(row=1, column=1)
        tk.Label(levelpanel, text="Height:").grid(row=2, column=0)
        self.levelheight = tk.Spinbox(levelpanel, from_=5, to=100, width=3)
        self.levelheight.grid(row=2, column=1)
        tk.Button(levelpanel, text="Apply", command=self.changelevel).grid(row=3, column=0, columnspan=2)

        tilepanel = tk.Frame(sidepanel)
        tilepanel.pack()
        tk.Label(tilepanel, text="Current tile:").pack()
        self.currenttileimg = ImageTk.PhotoImage(self.tileset[self.select])
        self.currenttile = tk.Label(tilepanel, image=self.currenttileimg)
        self.currenttile.pack()
        self.tiletypevar = tk.StringVar()
        self.tiletypevar.set(TileType[0]) # default value
        tk.OptionMenu(
            tilepanel, self.tiletypevar,
            *[TileType[x] for x in range(0, len(TileType))],
            command=self.changetype).pack()

        layerpanel = tk.Frame(sidepanel)
        layerpanel.pack()
        tk.Label(layerpanel, text="Layer:").grid(row=0, column=0)
        self.layerspin = tk.Spinbox(layerpanel, from_=0, to=99, width=3,
                                command=lambda *x:
                                self.setlayer(int(self.layerspin.get())))
        self.layerspin.delete(0, "end")
        self.layerspin.insert(0,0)
        self.layerspin.grid(row=0, column=1)
                
        musicpanel = tk.Frame(sidepanel)
        musicpanel.pack()
        tk.Label(musicpanel, text="Music: ").grid(row=0, column=0)
        self.spinner = tk.Spinbox(musicpanel, from_=0, to=99, width=3,
                             command=lambda *x: 
                             self.room.setarea(int(self.spinner.get())))
        self.spinner.delete(0, "end")
        self.spinner.insert(0,0)
        self.spinner.grid(row=0, column=1)

        self.statusbar = tk.Label(self, text="Loaded successfully!", bd=1,
                                  relief=tk.SUNKEN, anchor=tk.W)
        self.statusbar.grid(row=100, column=0, columnspan=4, sticky=tk.W+tk.E)

    def drawroom(self):
        self.roomimg = self.room.draw(self.layer)
        self.roomimgTk = ImageTk.PhotoImage(self.roomimg)
        self.viewcanvas.itemconfig(self.viewcanvasimage,
                                   image=self.roomimgTk)
        self.viewcanvas.config(
            scrollregion=(0, 0, 
                          self.roomimgTk.width(), self.roomimgTk.height()))

        self.renderimg = self.room.render()
        self.renderTk = ImageTk.PhotoImage(self.renderimg)
        self.rendercanvas.itemconfig(self.rendercanvasimage,
                                     image=self.renderTk)
        self.rendercanvas.config(
            scrollregion=(0, 0, 
                          self.renderTk.width(), self.renderTk.height()))        

        [self.viewcanvas.delete(x) for x in self.objectview]
        i = 0
        for x in self.room.objects:
            if x[1] == self.layer:
                color = "#00AA00"
                self.objectview.append(self.viewcanvas.create_text((
                                        x[2]*32+16, x[3]*32+16), fill=color,
                                        text=str(i),
                                        font=('Helvetica', -16)))
            i = i + 1
        self.lentry.delete(0, tk.END)
        self.lentry.insert(0, str(self.layer))

        self.levelwidth.delete(0, tk.END)
        self.levelwidth.insert(0, str(self.room.width))
        
        self.levelheight.delete(0, tk.END)
        self.levelheight.insert(0, str(self.room.height))

    
    def changelevel(self):
        width = int(self.levelwidth.get())
        height = int(self.levelheight.get())
        self.room.resize(width, height)
        self.statusbar.config(
            text="Resized room to {}x{}".format(str(width), str(height)))
        self.drawroom()

    def tileclick(self, event):
        x = math.floor(self.tilecanvas.canvasx(event.x) / 32)
        #y = math.floor(self.tilecanvas.canvasy(event.y) / 32)

        self.select = x
        
    def tilemove(self, event):
        clickX = math.floor(self.tilecanvas.canvasx(event.x) / 32)
        
        self.statusbar.config(
                text="Tile #{}".format(clickX))

    def viewclick(self, event):
        clickX = math.floor(self.viewcanvas.canvasx(event.x) / 32)
        clickY = math.floor(self.viewcanvas.canvasy(event.y) / 32)
        
        if self.room.get(self.layer, clickX, clickY) != self.select:
            self.room.set(self.layer, clickX, clickY, self.select)
            self.drawroom()

    def cviewclick(self, event):
        clickX = math.floor(self.viewcanvas.canvasx(event.x) / 32)
        clickY = math.floor(self.viewcanvas.canvasy(event.y) / 32)
        self.xentry.delete(0, tk.END)
        self.xentry.insert(0, str(clickX))
        self.yentry.delete(0, tk.END)
        self.yentry.insert(0, str(clickY))

    def rviewclick(self, event):
        clickX = math.floor(self.viewcanvas.canvasx(event.x) / 32)
        clickY = math.floor(self.viewcanvas.canvasy(event.y) / 32)
        self.select = self.room.get(self.layer, clickX, clickY)

    def viewmove(self, event):
        clickX = math.floor(self.viewcanvas.canvasx(event.x) / 32)
        clickY = math.floor(self.viewcanvas.canvasy(event.y) / 32)
        
        self.statusbar.config(
                text="Coordinates: {}, {}".format(clickX, clickY))

    # def gridclick(self, event):
    #     clickX = math.floor(self.gridcanvas.canvasx(event.x) / 20)
    #     clickY = math.floor(self.gridcanvas.canvasy(event.y) / 20)
    #     self.movegrid(clickX, clickY, False)

    def moveset(self, i, relative=True):
        if relative:
            i = self.currenti + i

        if (i >= 0 and i < 16):
            self.currenti = i
            self.room = self.roomset.getroom(self.currenti)
            self.layerspin.delete(0, "end")
            self.layerspin.insert(0, 0)
            self.spinner.delete(0,"end")
            self.spinner.insert(0,self.room.music)
            self.drawroom()
            self.enumerateobjects()
            self.statusbar.config(
                    text="Loaded room #{}".format(i))

    def delroom(self, *args):
         self.roomset.delroom(self.currenti)
         self.moveset(0,False)

    def save(self):
        filen = filedialog.asksaveasfilename(
                defaultextension=".js",
                initialfile="worldfile.js",
                initialdir="../",
                filetypes=(("Javascript files", "*.js"),
                           ("All files", "*")),
                title="Save")
        if filen != () and filen != "":
            with open(filen, "w") as fileo:
                fileo.seek(0)
                fileo.write("var worldfile = \n"+
                            json.dumps(self.roomset.dump())+"\n")
                fileo.truncate()

    def open(self):
        filen = filedialog.askopenfilename(
                defaultextension=".js",
                initialfile="worldfile.js",
                initialdir="../",
                filetypes=(("Javascript files", "*.js"),
                           ("All files", "*")),
                title="Save")
        if filen != () and filen != "":
            with open(filen, "r") as fileo:
                header = fileo.readline()
                if header != "var worldfile = \n":
                    self.statusbar.config(text="Not a proper worldfile!")
                    return
                data = fileo.readline()
                self.roomset.load(json.loads(data))
            # self.drawgrid(0,0)
            self.currenti = 0
            self.room = self.roomset.getroom(0)
            self.drawroom()
            self.enumerateobjects()
    
    def enumerateobjects(self):
        self.objectlist.delete(0, tk.END)
        for i,x in enumerate(self.room.objects):
            self.objectlist.insert(
                i, "#{}: Layer {} at {}, {}: {}".format(
                    i, x[1], x[2], x[3], x[0]
                )
            )

    def addarbitrary(self):
        if (self.arbitraryentry.get() == ""):
            return
        newobj = (self.arbitraryentry.get(), int(self.lentry.get()),
                  int(self.xentry.get()), int(self.yentry.get()))
        text = "#{}: Layer {} at {}, {}: {}".format(
            str(len(self.room.objects)),
            newobj[1], newobj[2], newobj[3], newobj[0]
            )
        self.objectlist.insert(len(self.room.objects), text)
        self.room.objects.append(newobj)
        self.drawroom()

    def deleteobj(self):
        todel = self.objectlist.curselection()
        if len(todel) == 0:
            # Nothing to delete
            return
        self.objectlist.delete(todel[0])
        self.room.objects.pop(todel[0])
        self.drawroom()
    
    def editobj(self):
        toedit = self.objectlist.curselection()
        if len(toedit) == 0:
            # Nothing to edit
            return
        editobj = self.room.objects.pop(toedit[0])
        self.objectlist.delete(toedit[0])
        self.drawroom()
        self.arbitraryentry.delete(0, tk.END)
        self.arbitraryentry.insert(0, editobj[0])
        self.xentry.delete(0, tk.END)
        self.xentry.insert(0, str(editobj[2]))
        self.yentry.delete(0, tk.END)
        self.yentry.insert(0, str(editobj[3]))
        self.lentry.delete(0, tk.END)
        self.lentry.insert(0, str(editobj[1]))

    def setlayer(self, x):
        self.layer = x
        self.room.checklayer(x)
        self.drawroom()

    @property
    def select(self):
        return self.__select

    @select.setter
    def select(self, value):
        self.__select = value
        self.currenttileimg = ImageTk.PhotoImage(self.tileset[self.select])
        self.currenttile.config(image=self.currenttileimg)
        self.tiletypevar.set(TileType[self.roomset.key[self.select]])

    def changetype(self, *args):
        self.statusbar.config(
                text="Changed tile #{} to type {}".format(self.select, self.tiletypevar.get()))
        self.roomset.key[self.select] = TypeTile[self.tiletypevar.get()]

class Room:
    def __init__(self, tileset, width=10, height=10):
        self.width = width
        self.height = height
        self.tileset = tileset
        self.music = 0
        self.tiles = [[0 for x in range(0,self.width*self.height)]]
        self.objects = []
        self.properties = []
        self.startpoint = [0,0,0]

    def checklayer(self, l):
        if l >= len(self.tiles):
            for i in range(len(self.tiles), l+1):
                self.tiles.append([0 for x in range(0,self.width*self.height)])

    def set(self, l, x, y, v):
        if x >= self.width or y >= self.height or x < 0 or y < 0:
            return
        self.tiles[l][x + y*self.width] = v

    def get(self, l, x, y):
        if x >= self.width or y >= self.height or x < 0 or y < 0:
            return 0
        return self.tiles[l][x + y*self.width]

    def resize(self, w, h):
        newtiles = [([0 for x in range(0, w*h)]) for x in range(0, len(self.tiles))]
        for z in range(0, len(self.tiles)):
            i = 0
            for y in range(0, h):
                for x in range(0, w):
                    newtiles[z][i] = self.get(z, x, y)
                    i = i + 1
        self.width = w
        self.height = h
        self.tiles = newtiles

    def setarea(self, x):
        self.music = x
    
    def render(self, top=0, left=0):
        image = Image.new(
            "RGB",(
                (self.width+self.height)*16+32, (self.width+self.height)*16+16))
        i = 0
        left = left+(self.width+self.height)*8
        top = top+(self.width+self.height)*8
        for z in range(0, len(self.tiles)):
            for y in range(0, self.height):
                for x in range(0, self.width):
                    if self.tiles[z][i] != 0:
                        coord = isometric(((x-z)*16, (y-z)*16))
                        tile = self.tileset[self.tiles[z][i]]
                        image.paste(tile,(left + coord[0], top + coord[1]), 
                                    tile)
                    i = i+1
            i = 0

        return image

    def draw(self, layer, image=None, top=0, left=0):
        if image is None:
            image = Image.new("RGB",(self.width*32, self.height*32))
        i = 0
        draw = ImageDraw.Draw(image)
        for y in range(0, self.height):
            for x in range(0, self.width):
                draw.rectangle((left+x*32, top+y*32,
                        left+x*32+32, top+y*32+32),
                    TileColor[self.tiles[layer][i]])
                draw.text((left+x*32+8, top+y*32+8), str(self.tiles[layer][i]), (0,0,0))
                i = i+1
        return image

    def dump(self):
        return {"width": self.width, "height": self.height,
                "tiles": self.tiles,
                "objects": self.objects,
                "music": self.music,
                "startpoint": self.startpoint,
                "properties": self.properties}

    @staticmethod
    def load(loaded, tileset):
        self = Room(tileset, loaded["width"], loaded["height"])
        self.tiles = loaded["tiles"]
        self.objects = loaded["objects"]
        self.startpoint = loaded["startpoint"]
        self.properties = loaded["properties"]
        print(loaded["startpoint"])
        return self

class RoomList:
    def __init__(self, tileset):
        self.tileset = tileset
        self.rooms = []
        self.key = [0] * len(tileset)

    def getroom(self, i):
        if len(self.rooms) >= i:
            self.rooms.append(Room(self.tileset))
        return self.rooms[i]

    def delroom(self, i):
        newrooms = []
        for j in range(0, len(self.rooms)):
            if (i != j):
                newrooms.append(self.rooms[j])
        if len(newrooms) == 0:
            self.rooms.append(Room(self.tileset))

    def dump(self):
        output = {}
        output["rooms"] = [x.dump() if isinstance(x, Room) else x 
            for x in self.rooms]
        output["key"] = self.key
        return output

    def load(self, dumped):
        self.rooms = [Room.load(x, self.tileset) for x in dumped["rooms"]]
        self.key = dumped["key"] + [0]*(len(self.tileset)-len(dumped["key"]))

def isometric(pair):
    x = pair[0]
    y = pair[1]
    return (x - y, (x + y) // 2)


root = tk.Tk()
app = Application(master=root)
app.mainloop()

