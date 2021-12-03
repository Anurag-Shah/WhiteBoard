
#############################################################################
# ocr_postprocess_test.py
#
# Authors: Anurag
#
# Performs postprocess on text outputted from OCR
#############################################################################

import ocr_utils
from ocr_utils import OCRError

# ocr_postprocess
# Author: Anurag
# Return value: string of data
# Parameters:
#	1. text - text from OCR
# This function performs any postprocessing needed on text

def ocr_postprocess(text):
	return text

# tesseract_postprocess
# Author: Anurag
# Return value: string of data
# Parameters:
#	1. text - text from OCR
# This function performs tesseract postprocessing

def tesseract_postprocess(text):
	o = text.replace("%", "%%")
	o = o.replace("\\n", "\n")
	o = o[0:len(o)-2]
	return o