
#############################################################################
# ocr.py
#
# Authors: Anurag
#
# Performs OCR given a file name
#############################################################################


import sys
from PIL import Image
sys.path.insert(1, "../../Compiler")
sys.path.insert(1, "../../OCR")
from ocr_wrapper import ocr_wrapper
from compiler_wrapper import compiler_wrapper

# ocr_wrapper
# Author: Anurag
# Return value: (string of data, programming langauge)
# Parameters:
#	1. image - image matrix
# This function is a wrapper for the entire OCR Process
# Calls functions in:
#	Backend/OCR/ocr_wrapper.py
#	Backend/Compiler/compiler_wrapper.py

def ocr(fname):
	compiler_wrapper(ocr_wrapper(Image.open(fname)))


if __name__ == "__main__":
	# Testing function for pipeline
	test_im_path = "../../OCR/images/tesseract_tests/"
	test_im = "test2"
	imsuffix = ".png"
	print(ocr(test_im_path + test_im + imsuffix))