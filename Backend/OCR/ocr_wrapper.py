
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
from ocr_utils import OCRError, apply_orientation
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

def ocr_wrapper(image, texttype=None):
	if texttype is None:
		texttype = ocr_texttype_detection.detect(image)
	code = ""
	out = ""
	if texttype == "handwritten":
		out = preprocess_handwritten.preprocess_image(image)
		ocr_out_text = ocr_typeform.ocr_tesseract(out)
		code = ocr_postprocess_text.tesseract_postprocess(ocr_out_text)
	elif texttype == "typeform":
		out = preprocess_typeform.preprocess_tesseract(image, hh=False)
		ocr_out_text = ocr_typeform.ocr_tesseract(out)
		code = ocr_postprocess_text.tesseract_postprocess(ocr_out_text)
	else:
		raise OCRError
	language = ocr_lang_detect.detect(code)
	return (code, language, out, texttype)

def main():
	# Testing function for pipeline
	test_im_path = "images/tesseract_tests/"
	for i, im in enumerate(ocr_utils.ims):
		image = apply_orientation(Image.open(test_im_path + im))
		image = image.convert('RGB')
		if i <= 5:
			out = ocr_wrapper(image)
		else:
			out = ocr_wrapper(image, texttype="handwritten")
		print(out)
		out[2].show()

if __name__ == "__main__":
	main()