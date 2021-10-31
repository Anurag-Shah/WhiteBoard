
#############################################################################
# ocr_wrapper.py
#
# Authors: Anurag
#
# Provides a wrapper interface to the rest of the OCR code
# It takes in an image and any other related data we decide to add later
# Its output is the text read from the image
#############################################################################

import ocr_utils
from ocr_utils import OCRError
import preprocess_handwritten
import preprocess_typeform
import charseg_handwritten
import charseg_typeform
import ocr_handwritten
import ocr_typeform
import ocr_postprocess_text
import ocr_texttype_detection
import ocr_lang_detect
import ocr_postprocess_image

from PIL import Image

# ocr_wrapper
# Author: Anurag
# Return value: (string of data, programming langauge)
# Parameters:
#	1. image - image matrix
# This function is a wrapper for the entire OCR Process
# Calls functions in:
#	proprocess_handwritten.py
#	preprocess_typeform.py
#	charseg_handwritten.py
#	charseg_typeform.py
#	ocr_handwritten.py
#	ocr_typeform.py
#	ocr_postprocess_text.py
#	ocr_texttype_detection.py

def ocr_wrapper(image):
	texttype = ocr_texttype_detection.detect(image)
	code = ""
	out_image = ""
	if texttype == "typeform":
		im = preprocess_typeform.preprocess_image(image)
		out = ""
		for char in charseg_typeform.segment(im):
			out += ocr_typeform.ocr_typeform(im)
		code = ocr_postprocess_text.ocr_postprocess(out)
		out_image = im
	elif texttype == "handwritten":
		im = preprocess_handwritten.preprocess_image(image)
		out = ""
		for char in charseg_handwritten.segment(im):
			out += ocr_handwritten.ocr_handwritten(im)
		code = ocr_postprocess_text.ocr_postprocess(out)
		out_image = im
	elif texttype == "typeform_pretrained":
		out = preprocess_typeform.preprocess_tesseract(image)
		out_image = out
		ocr_out_text = ocr_typeform.ocr_tesseract(out)
		code = ocr_postprocess_text.tesseract_postprocess(ocr_out_text)
	else:
		raise OCRError
	language = ocr_lang_detect.detect(code)
	return (code, language, out_image, texttype)


if __name__ == "__main__":
	# Testing function for pipeline
	test_im_path = "images/tesseract_tests/"
	test_im = "min_area_rect_test"
	imsuffix = ".png"
	print(ocr_wrapper(Image.open(test_im_path + test_im + imsuffix).convert('RGB')))