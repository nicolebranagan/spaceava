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
    
    
tk.Tk() # Initialize Tk system

pixelgrid = PixelGrid([(0,0,0)])
with open("space-ava.terra", "r") as fileo:
    pixelgrid.load(json.load(fileo))

process("../")
