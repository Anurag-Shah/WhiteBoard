
#############################################################################
# ocr.py
#
# Authors: Anurag
#
# Performs OCR given a file name
#############################################################################

# Do not touch the next 3 lines

import sys

# Do not move the above around or change the order otherwise the other import statements will break
# Add any future import statements below this line

import os
from PIL import Image
from ocr_wrapper import ocr_wrapper
from compiler_wrapper import compiler_wrapper

# ocr_wrapper
# Author: Anurag
# Return value: compiler's output
# Parameters:
#	1. fname - file name
# This function is a wrapper for the entire OCR Process
# Calls functions in:
#	Backend/OCR/ocr_wrapper.py
#	Backend/Compiler/compiler_wrapper.py

def ocr(fname):
	image = Image.open(fname)
	os.chdir("../../OCR")
	ocr_out = ocr_wrapper(image)
	os.chdir("../Compiler")
	compiler_out = compiler_wrapper(ocr_out)
	os.chdir("../WhiteBoardBackEnd/API")
	return compiler_out

if __name__ == "__main__":
	# Testing function for pipeline
	test_im_path = "../../OCR/images/tesseract_tests/"
	test_im = "test2"
	imsuffix = ".png"
	print(ocr(test_im_path + test_im + imsuffix))