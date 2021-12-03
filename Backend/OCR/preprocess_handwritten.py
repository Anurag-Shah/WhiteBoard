
#############################################################################
# preprocess_handwritten.py
#
# Authors: Anurag
#
# Performs preprocess operations on handwritten code image
# Also will include various functions for preprocessing segmented character
#############################################################################

import ocr_utils
from ocr_utils import OCRError
from preprocess_typeform import preprocess_tesseract

# preprocess_image
# Author: Anurag
# Return value: image matrix
# Parameters:
#	1. image - image matrix
# Preprocess image

def preprocess_image(image):
	return preprocess_tesseract(image, hh=True)

def main():
	image = apply_orientation(Image.open("images/tesseract_tests/ph1.jpg"))
	preprocess_image(image).show()

if __name__ == "__main__":
	main()