
#############################################################################
# ocr_utils.py
#
# Authors: Anurag
#
# Utilities for OCR
#############################################################################

from guesslang import Guess
from PIL import Image

GLOBAL_GUESSER = Guess()

ims = [
	"test2.png",
	"test_java.png",
	"test_cpp.png",
	"test_cs.png",
	"test_broken.png",
	"test_tall_1.jpg",
	"test_nontrivial_2.png",
	"ph3.jpg"
	]

# OCRError
# Error type for error in OCR
class OCRError(Exception):
	def __init__(self, message, stage):
		self.message = message		# Error details
		self.stage = stage			# Where in the pipeline the error occured

def flip_horizontal(im):
	return im.transpose(Image.FLIP_LEFT_RIGHT)

def flip_vertical(im):
	return im.transpose(Image.FLIP_TOP_BOTTOM)

def rotate_180(im):
	return im.transpose(Image.ROTATE_180)

def rotate_90(im):
	return im.transpose(Image.ROTATE_90)

def rotate_270(im):
	return im.transpose(Image.ROTATE_270)

def transpose(im):
	return rotate_90(flip_horizontal(im))

def transverse(im):
	return rotate_90(flip_vertical(im))

def apply_orientation(image):
	try:
		orientation_funcs = [None, lambda x: x, flip_horizontal, rotate_180, flip_vertical, transpose, rotate_270, transverse, rotate_90]
		tag = 0x0112
		if hasattr(image, '_getexif'):
			e = image._getexif()
			if e is not None:
				orientation = e[tag]
				function = orientation_funcs[orientation]
				return function(image)
	except:
		return image
	return image