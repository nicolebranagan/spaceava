# process.py
#
# Loads magisc.terra and converts it into the necessary image files

from pixelgrid import *
import tkinter as tk
import json
import csv

def rgb(hex_color):
    split = (hex_color[1:3], hex_color[3:5], hex_color[5:7])
    return tuple([int(x, 16) for x in split])

def process(designation):
    # Objects (objects.png)
    filen = designation + "objects.png"
    pixelgrid.changepage(2)
    pixelgrid.getTkStrip(2, False).write(filen)
    
    # Scenery/Tiles (tiles.png)
    filen = designation + "tiles.png"
    pixelgrid.changepage(3)
    pixelgrid.getTkStrip(2, False).write(filen)

    # Faces (faces.png)
    filen = designation + "faces.png"
    pixelgrid2.changepage(0)
    pixelgrid2.getTkStrip(5, block=False).write(filen)
    
    # BG1 (bg1.png)
    filen = designation + "bg1.png"
    pixelgrid2.changepage(1)
    pixelgrid2.getTkStrip(8, block=False).write(filen)

    # Title (bg1.png)
    filen = designation + "title.png"
    pixelgrid3.getTkStrip(24, block=False).write(filen)
    
tk.Tk() # Initialize Tk system

pixelgrid = PixelGrid([(0,0,0)])
with open("space-ava.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))

pixelgrid2 = PixelGrid([0,0,0])
with open("space-faces.terra", "r") as fileo:
    pixelgrid2.load(json.load(fileo))

pixelgrid3 = PixelGrid([0,0,0])
with open("space-title.terra", "r") as fileo:
    pixelgrid3.load(json.load(fileo))

process("../")
