
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

def ocr(image_file_name, input_text=None, texttype=None, imlang=None):
	# Setup migrated into the function
	from ocr_wrapper import ocr_wrapper
	from compiler_wrapper import compiler_wrapper
	from ocr_postprocess_image import ocr_postprocess_image
	import ocr_lang_detect
	from ocr_utils import apply_orientation

	# Output:
	# 1. Postprocessed image
	# 2. Text output (OCR Output)
	# 3. Result (Execution result / Stack trace / Compilation errors)
	# 4. Image Type (Typeform / Handwritten / Text [non-image])
	# 5. Image Programming Language
	# 6. Error line y-coordinates
	# 7. Error Line Numbers

	outimage = None
	ocr_out = ""
	compiler_out = ""
	imtype = ""
	left_coords = None
	line_numbers = []
	if texttype is None:
		hh = True
	else:
		hh = False

	if image_file_name != None:
		image = Image.open(image_file_name)
		image = apply_orientation(image)
		image = image.convert('RGB')
		ocr_out, imlang, outimage, imtype = ocr_wrapper(image, texttype=texttype, imlang=imlang)
		while "\n\n" in ocr_out:
			ocr_out = ocr_out.replace("\n\n", "\n")
		compiler_out = ''
		while compiler_out == '':
			compiler_out, line_numbers = compiler_wrapper(ocr_out, imlang)
		outimage, left_coords = ocr_postprocess_image(image, line_numbers, hh=hh)
	else:
		# Raw text input
		if imlang is None:
			imlang = ocr_lang_detect.detect(input_text)
		compiler_out = ''
		while compiler_out == '':
			compiler_out, line_numbers = compiler_wrapper(input_text, imlang)
		print(input_text)
		imtype = "Text"
		ocr_out = None
		print(compiler_out)
	imtype = "Typeform"
	return outimage, ocr_out, compiler_out, imtype, imlang, left_coords, line_numbers

def main():
	sys.path.insert(1, os.path.abspath("../../Compiler"))
	sys.path.insert(1, os.path.abspath("../../OCR"))
	import ocr_utils
	# Testing function for pipeline
	print("Testing Images\n")
	test_im_path = "../../OCR/images/tesseract_tests/"
	for i, im in enumerate(ocr_utils.ims):
		print("\nImage: " + im)
		if i <= 6:
			out = ocr(test_im_path + im, "typeform")
		else:
			out = ocr(test_im_path + im, "handwritten")
		print(out)
		out[0].save("result" + im + ".png")
	print("\n\nTesting Code\n")
	print(ocr(None, '#include<stdio.h>\nint main() {printf("Hello World");}'))

if __name__ == "__main__":
	main()