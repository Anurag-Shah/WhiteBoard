
#############################################################################
# preprocess_typeform.py
#
# Authors: Anurag
#
# Performs preprocess operations on typeform code image
# Also will include various functions for preprocessing segmented character
#############################################################################

import ocr_utils
from ocr_utils import OCRError

# MAX RESIZE DIMENSIONS
MAX_R_W = 850
MAX_R_H = 1500

# preprocess_image
# Author: Anurag
# Return value: image matrix
# Parameters:
#	1. image - image matrix
# Preprocess image

def preprocess_image(image):
	return image

def preprocess_tesseract(image):
	# Find min area rectangle of image
	out = image
	if image.size[0] > image.size[1]:
		# width > height
		# if width is over MAX_R_W, resize to MAX_R_W
		if image.size[0] > MAX_R_W:
			nheight = int(MAX_R_W * image.size[1] / image.size[0])
			out = image.resize((MAX_R_W, nheight))
	else:
		# width < height
		# if height is over MAX_R_H, resize to MAX_R_H
		if image.size[1] > MAX_R_W:
			nwidth = int(MAX_R_H * image.size[0] / image.size[1])
			out = image.resize((nwidth, MAX_R_H))
	return out