
#############################################################################
# ocr_typeform.py
#
# Authors: Anurag
#
# Performs character recognition on a single typeform character image
# Currently uses the Tesseract model, bypassing character segmentation
# and any pre and post processing
# When this is replaced with a personal model, it will integrate into
# the pipeline proper
#############################################################################

import ocr_utils
from ocr_utils import OCRError

# ocr_typeform
# Author: Anurag
# Return value: single character
# Parameters:
#	1. image - image matrix
# This function is a wrapper for the entire OCR Process

def ocr_typeform(image):
	return '\0'

# ocr_tesseract
# Author: Anurag
# Return value: string of text
# Parameters:
#	1. image - image matrix
# This function uses the tesseract library to perform OCR on an image

def ocr_tesseract(image):
	return image