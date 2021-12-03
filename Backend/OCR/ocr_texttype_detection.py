
#############################################################################
# ocr_texttype_detection.py
#
# Authors: Anurag
#
# Provides a wrapper interface to the rest of the OCR code
# It takes in an image and any other related data we decide to add later
# Its output is the text read from the image
#############################################################################

import ocr_utils
from ocr_utils import OCRError

# detect
# Author: Anurag
# Return value: "typeform" or "handwritten"
# Parameters:
#	1. image - image matrix
# Detects if text is typeform or handwritten

def detect(image):
	return "typeform"