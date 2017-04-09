# process.py
#
# Loads magisc.terra and converts it into the necessary image files

from pixelgrid import *
import tkinter as tk
import json
import csv
import time

def rgb(hex_color):
    split = (hex_color[1:3], hex_color[3:5], hex_color[5:7])
    return tuple([int(x, 16) for x in split])

def process(designation):
    # Objects (objects.png)
    filen = designation + "objects.gif"
    pixelgrid.changepage(2)
    pixelgrid.getTkStrip(2, False).write(filen, format='gif')
    
    # Scenery/Tiles (tiles.png)
    filen = designation + "tiles.gif"
    pixelgrid.changepage(3)
    pixelgrid.getTkStrip(2, False).write(filen, format='gif')

    # Scenery/Tiles (font.png)
    filen = designation + "font.gif"
    pixelgrid.changepage(4)
    pixelgrid.getTkStrip(1, False).write(filen, format='gif')

    # Faces (faces.png)
    filen = designation + "faces.gif"
    pixelgrid2.changepage(0)
    strip = pixelgrid2.getTkStrip(5, block=False).write(filen, format='gif')
    
    # BG1 (bg1.png)
    filen = designation + "bg1.gif"
    pixelgrid2.changepage(1)
    pixelgrid2.getTkStrip(8, block=False).write(filen, format='gif')

    # Title (title.png)
    filen = designation + "title.gif"
    pixelgrid3.getTkStrip(24, block=False).write(filen, format='gif')

    # Logo (logo.png)
    filen = designation + "logo.gif"
    pixelgrid3.changepage(2)
    pixelgrid3.getTkStrip(4, block=False).write(filen, format='gif')
    
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
