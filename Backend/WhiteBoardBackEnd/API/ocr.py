
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
#	1. image_file_name - file name
#	2. input_text - optional argument, text input
# This function is a wrapper for the entire OCR Process
# Calls functions in:
#	Backend/OCR/ocr_wrapper.py
#	Backend/Compiler/compiler_wrapper.py

def ocr(image_file_name, input_text=None):
	# Setup migrated into the function
	from ocr_wrapper import ocr_wrapper
	from compiler_wrapper import compiler_wrapper
	from ocr_postprocess_image import ocr_postprocess_image
	import ocr_lang_detect

	# Output:
	# 1. Postprocessed image
	# 2. Text output
	# 3. Result
	# 4. Image Type (Typeform / Handwritten / Text [non-image])
	# 5. Image Programming Language
	# 6. Error line y-coordinates

	outimage = None
	ocr_out = ""
	compiler_out = ""
	imtype = ""
	imlang = ""
	left_coords = None

	if image_file_name != None:
		image = Image.open(image_file_name).convert('RGB')
		ocr_out, imlang, outimage, imtype = ocr_wrapper(image)
		compiler_out, line_numbers = compiler_wrapper(ocr_out, imlang)
		post_image, left_coords = ocr_postprocess_image(outimage, line_numbers)
	else:
		# Raw text input
		imlang = ocr_lang_detect.detect(input_text)
		compiler_out, line_numbers = compiler_wrapper(input_text, imlang)
		imtype = "Text"
		ocr_out = None
	imtype = "Typeform"
	return outimage, ocr_out, compiler_out, imtype, imlang, left_coords

if __name__ == "__main__":
	sys.path.insert(1, os.path.abspath("../../Compiler"))
	sys.path.insert(1, os.path.abspath("../../OCR"))
	# Testing function for pipeline
	test_im_path = "../../OCR/images/tesseract_tests/"
	test_im = "test3"
	imsuffix = ".png"
	print(ocr(test_im_path + test_im + imsuffix))
	print(ocr(None, "hello"))