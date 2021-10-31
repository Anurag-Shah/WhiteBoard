
#############################################################################
# ocr.py
#
# Authors: Anurag
#
# Performs OCR given a file name
#############################################################################

import sys
import os
from PIL import Image
# ocr_wrapper
# Author: Anurag
# Return value: output list
# Parameters:
#	1. fname - file name
# This function is a wrapper for the entire OCR Process
# Calls functions in:
#	Backend/OCR/ocr_wrapper.py
#	Backend/Compiler/compiler_wrapper.py

def ocr(fname):
	# Setup migrated into the function
	from ocr_wrapper import ocr_wrapper
	from compiler_wrapper import compiler_wrapper

	# Output:
	# 1. Postprocessed image
	# 2. Text output
	# 3. Result
	# 4. Image Type (Typeform / Handwritten)
	# 5. Image Programming Language

	image = Image.open(fname).convert('RGB')
	ocr_out, imlang, outimage, line_coords = ocr_wrapper(image)
	compiler_out = compiler_wrapper(ocr_out)
	imtype = "Typeform"
	return outimage, ocr_out, compiler_out, imtype, imlang

if __name__ == "__main__":
	sys.path.insert(1, os.path.abspath("../../Compiler"))
	sys.path.insert(1, os.path.abspath("../../OCR"))
	print(sys.path)
	# Testing function for pipeline
	test_im_path = "../../OCR/images/tesseract_tests/"
	test_im = "test2"
	imsuffix = ".png"
	print(ocr(test_im_path + test_im + imsuffix))