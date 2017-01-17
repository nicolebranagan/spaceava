import math
import json
import tkinter as tk
import subprocess
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

TileColor = {
    0 : "#000000",
    1 : "#BC88A0",
    2 : "#16AE49",
    3 : "#3048DE",
    4 : "#99EE59",
    5 : "#CCEEDD",
    6 : "#8899EE",
    7 : "#99EE88",
    8 : "#22EEFF",
    9 : "#670000",
    -1 : "#FFFFFF",
}

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
       
        scrolltilecanvas = tk.Scrollbar(self, orient=tk.HORIZONTAL)
        scrolltilecanvas.grid(row=1, column=0, columnspan=4, sticky=tk.W+tk.E)
        self.tilecanvas = tk.Canvas(self, 
                                    scrollregion=(0,0,self.tiles.width,
                                                  self.tiles.height),
                                    height=self.tiles.height,
                                    xscrollcommand=scrolltilecanvas.set)
        self.tilecanvasimg = self.tilecanvas.create_image(
                0,0,anchor=tk.NW,image=self.tilesTk)
        self.tilecanvas.grid(row=0, column=0, columnspan=4, sticky=tk.W+tk.E)
        self.tilecanvas.bind("<Button-1>", self.tileclick)
        self.tilecanvas.bind("<Motion>", self.tilemove)
        scrolltilecanvas.config(command=self.tilecanvas.xview)

        # self.gridcanvas = tk.Canvas(self, width=320, height=320)
        # self.gridcanvas.grid(row=2, column=0)
        # self.gridcanvasimage = self.gridcanvas.create_image(0,0,anchor=tk.NW)
        # self.gridcanvas.bind("<Button-1>", self.gridclick)
        
        viewpanel = tk.Frame(self)
        viewpanel.grid(row=2, column=1)
        self.viewcanvas = tk.Canvas(viewpanel, width=10*32, height=10*32)
        self.viewcanvas.grid(row=0, column=0,columnspan=3)
        self.viewcanvasimage = self.viewcanvas.create_image(0,0,anchor=tk.NW)
        self.viewcanvas.bind("<Button-1>", self.viewclick)
        self.viewcanvas.bind("<B1-Motion>", self.viewclick)
        self.viewcanvas.bind("<Motion>", self.viewmove)
        self.viewcanvas.bind("<Button-2>", self.cviewclick)
        self.viewcanvas.bind("<Button-3>", self.rviewclick)
        self.spinner = tk.Spinbox(viewpanel, from_=0, to=99, width=3,
                             command=lambda *x: 
                             self.room.setarea(int(self.spinner.get())))
        self.spinner.delete(0, "end")
        self.spinner.insert(0,0)
        self.spinner.grid(row=1, column=0)

        renderpanel = tk.Frame(self)
        renderpanel.grid(row=3, column=1)
        self.rendercanvas = tk.Canvas(renderpanel, width=10*32, height=10*32)
        self.rendercanvas.grid(row=0, column=0)
        self.rendercanvasimage = self.rendercanvas.create_image(0,0,anchor=tk.NW)

        imagebutton = tk.Button(
            viewpanel, text="Update images", command=
            lambda: subprocess.Popen(
                ["python3", "process.py"], cwd="../images/process/"))
        imagebutton.grid(row=1, column=1)

        dumpmapbutton = tk.Button(
            viewpanel, text="Dump map", command=
            lambda: self.roomset.drawgrid().save("map.png"))
        dumpmapbutton.grid(row=1, column=2)

        self.objectview = []

        controls = tk.Frame(self, width=12*32, height=12*32)
        controls.grid(row=2, column=2)
        loadbutton = tk.Button(controls, text="Open", command=self.open)
        loadbutton.grid(row=0, column=0)
        savebutton = tk.Button(controls, text="Save", command=self.save)
        savebutton.grid(row=0, column=1)

        self.objectlist = tk.Listbox(controls)
        self.objectlist.grid(row=1, column=0, columnspan=2)
        self.xentry = tk.Entry(controls, width=3)
        self.xentry.insert(0, "0")
        self.xentry.grid(row=2, column=0)
        self.yentry = tk.Entry(controls, width=3)
        self.yentry.insert(0, "0")
        self.yentry.grid(row=2, column=1)
        
        delbutton = tk.Button(controls, text="Delete selection",
                                   command=self.deleteobj )
        delbutton.grid(row=3, column=0, columnspan=2, sticky=tk.W)
        
        #self.selectedblock = tk.StringVar(self)
        #self.selectedblock.set(Type[100])
        #tk.OptionMenu(
        #        controls, self.selectedblock, 
        #        *[Type[x] for x in range(100,110)]).grid(
        #            row=4, column=0)
        #addblockbutton = tk.Button(controls, text="Add", 
        #                           command=lambda: self.addobject(
        #                               self.selectedblock.get) )
        #addblockbutton.grid(row=4, column=1, sticky=tk.W)

        #self.selectedenemy = tk.StringVar(self)
        #self.selectedenemy.set(Type[0])
        #tk.OptionMenu(
        #        controls, self.selectedenemy, 
        #        *[Type[x] for x in range(0,12)]).grid(
        #            row=5, column=0)
        #addenemybutton = tk.Button(controls, text="Add",
        #                           command=lambda: self.addobject(
        #                               self.selectedenemy.get) )
        #addenemybutton.grid(row=5, column=1, sticky=tk.W)
        
        self.arbitraryentry = tk.Entry(controls, width=3)
        self.arbitraryentry.insert(0, "200")
        self.arbitraryentry.grid(row=6, column=0)
        
        addenemybutton = tk.Button(controls, text="Add",
                                   command=self.addarbitrary )
        addenemybutton.grid(row=6, column=1, sticky=tk.W)

        tilepanel = tk.Frame(self)
        tilepanel.grid(row=2, column=3)
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
        #tk.Radiobutton(tilepanel, text="Clear", variable=self.tiletypevar,
        #               value=0, command=self.changetype).pack()


        self.statusbar = tk.Label(self, text="Loaded successfully!", bd=1,
                                  relief=tk.SUNKEN, anchor=tk.W)
        self.statusbar.grid(row=4, column=0, columnspan=4, sticky=tk.W+tk.E)

    def drawroom(self):
        self.roomimg = self.room.draw(self.layer)
        self.roomimgTk = ImageTk.PhotoImage(self.roomimg)
        self.viewcanvas.itemconfig(self.viewcanvasimage,
                                   image=self.roomimgTk)

        self.renderimg = self.room.render()
        self.renderTk = ImageTk.PhotoImage(self.renderimg)
        self.rendercanvas.itemconfig(self.rendercanvasimage,
                                     image=self.renderTk)

        [self.viewcanvas.delete(x) for x in self.objectview]
        for x in self.room.objects:
            if x[0] >= 107:
                color = "#00AA00"
                self.objectview.append(self.viewcanvas.create_text((
                                       x[1]*32+16, x[2]*32+16), fill=color,
                                       text=str(x[0]),
                                       font=('Helvetica', -16)))
            elif x[0] >= 100:
                self.objectview.append(
                        self.viewcanvas.create_image(
                            x[1]*32+16, x[2]*32+16, 
                            image=self.tilesetTk[x[0]-100+9]))
                self.objectview.append(
                        self.viewcanvas.create_rectangle(
                            x[1]*32, x[2]*32, x[1]*32+32-1, x[2]*32+32-1,
                            outline='blue'))
            else:
                color = "#FF0000"
                signif = Type[x[0]][-1]
                self.objectview.append(self.viewcanvas.create_text((
                                       x[1]*32+16, x[2]*32+16), fill=color,
                                       text=signif,
                                       font=('Helvetica', -32)))

    # def drawgrid(self,x,y):
    #     self.gridimg = self.roomset.draw(x, y)
    #     self.gridcanvas.itemconfig(self.gridcanvasimage,
    #                                image=self.gridimg)

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
        self.select = self.room.get(clickX, clickY)

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
            self.spinner.delete(0,"end")
            self.spinner.insert(0,self.room.area)
            self.drawroom()
            self.objectlist.delete(0, tk.END)
            #[self.objectlist.insert(i, "{}, {}, {}".format(*x)) 
            #    for i,x in enumerate(self.room.objects)]
            for i,x in enumerate(self.room.objects):
                if (x[0] >= 200):
                    self.objectlist.insert(
                        i, "Arbitrary {}: {}, {}".format(*x))
                else:
                    self.objectlist.insert(
                        i, "{}: {}, {}".format(Type[x[0]], x[1], x[2]))
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
                    print("Not a proper worldfile")
                    return
                data = fileo.readline()
                self.roomset.load(json.loads(data))
            # self.drawgrid(0,0)
            self.currenti = 0
            self.room = self.roomset.getroom(0)
            self.drawroom()
            self.objectlist.delete(0, tk.END)
            for i,x in enumerate(self.room.objects):
                if (x[0] >= 200):
                    self.objectlist.insert(
                        i, "Arbitrary {}: {}, {}".format(*x))
                else:
                    self.objectlist.insert(
                        i, "{}: {}, {}".format(Type[x[0]], x[1], x[2]))

    def addobject(self, source):
        val = source();
        if (val == ""):
            return
        blockid = TypeLabel[val]
        newobj = (blockid, int(self.xentry.get()), int(self.yentry.get()), True)
        text = "{}: {}, {}".format(val, newobj[1], newobj[2])
        self.objectlist.insert(len(self.room.objects), text)
        self.room.objects.append(newobj)
        self.drawroom()
    
    def addarbitrary(self):
        val = int(self.arbitraryentry.get())
        if (val == ""):
            return
        newobj = (val, int(self.xentry.get()), int(self.yentry.get()), True)
        text = "Arbitrary {}: {}, {}".format(val, newobj[1], newobj[2])
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

    def set(self, l, x, y, v):
        if x >= self.width or y >= self.height or x < 0 or y < 0:
            return
        if l >= len(self.tiles):
            for i in range(len(self.tiles), l+1):
                self.tiles[i] = [0 for x in range(0,self.width*self.height)]
        self.tiles[l][x + y*self.width] = v

    def get(self, l, x, y):
        if x >= self.width or y >= self.height or x < 0 or y < 0:
            return 0
        return self.tiles[l][x + y*self.width]

    def setarea(self, x):
        self.music = x
    
    def render(self, image=None, top=0, left=0):
        if image is None:
            image = Image.new("RGB",(self.width*32, self.height*32))
        i = 0
        for z in range(0, len(self.tiles)):
            for y in range(0, self.height):
                for x in range(0, self.width):
                    if self.tiles[z][i] != 0:
                        coord = isometric(((x-z)*16, (y-z)*16))
                        tile = self.tileset[self.tiles[z][i]]
                        image.paste(tile,(left + coord[0], top + coord[1]), 
                                    tile)
                    i = i+1
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
                "music": self.music}

    @staticmethod
    def load(loaded, tileset):
        self = Room(tileset, loaded["width"], loaded["height"])
        self.tiles = loaded["tiles"]
        self.objects = loaded["objects"]
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

