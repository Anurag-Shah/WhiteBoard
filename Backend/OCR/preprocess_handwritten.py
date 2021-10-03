
#############################################################################
# preprocess_handwritten.py
#
# Authors: Anurag
#
# Performs preprocess operations on handwritten code image
# Also will include various functions for preprocessing segmented character
#############################################################################

import ocr_utils
from ocr_utils import OCRError

# preprocess_image
# Author: Anurag
# Return value: image matrix
# Parameters:
#	1. image - image matrix
# Preprocess image

def preprocess_image(image):
	return image