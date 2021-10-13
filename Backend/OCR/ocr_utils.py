
#############################################################################
# ocr_utils.py
#
# Authors: Anurag
#
# Utilities for OCR
#############################################################################

# OCRError
# Error type for error in OCR
class OCRError(Exception):
	def __init__(self, message, stage):
		self.message = message		# Error details
		self.stage = stage			# Where in the pipeline the error occured

# preprocess_image
# Author: Anurag
# Return value: image matrix
# Parameters:
#	1. image - image matrix
# Preprocess image

def preprocess_image(image):
	return image