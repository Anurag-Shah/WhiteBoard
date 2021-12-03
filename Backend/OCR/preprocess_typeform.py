
#############################################################################
# preprocess_typeform.py
#
# Authors: Anurag
#
# Performs preprocess operations on typeform code image
# Also will include various functions for preprocessing segmented character
#############################################################################

from PIL import Image
from ocr_postprocess_image import detect_background_color
import numpy as np
import cv2
from ocr_utils import apply_orientation, OCRError
import math

# MAX RESIZE DIMENSIONS
MAX_R_W = 850
MAX_R_H = 1500

# preprocess_image
# Author: Anurag
# Return value: image matrix
# Parameters:
#	1. image - image matrix
# Preprocess image

def preprocess_image(image):
	return preprocess_tesseract(image)

def preprocess_tesseract(image, hh=False):
	# Find min area rectangle of image
	out = image
	if image.size[0] > image.size[1]:
		# width > height
		# if width is over MAX_R_W, resize to MAX_R_W
		if image.size[0] > MAX_R_W:
			nheight = int(MAX_R_W * image.size[1] / image.size[0])
			out = image.resize((MAX_R_W, nheight))
	else:
		# width < height
		# if height is over MAX_R_H, resize to MAX_R_H
		if image.size[1] > MAX_R_W:
			nwidth = int(MAX_R_H * image.size[0] / image.size[1])
			out = image.resize((nwidth, MAX_R_H))
	# postproc code reused
	out2 = np.array(out)
	out2 = out2[:, :, ::-1].copy()
	bg_color = detect_background_color(out2)
	gray = cv2.cvtColor(out2, cv2.COLOR_BGR2GRAY)
	if (bg_color[0] + bg_color[1] + bg_color[2]) / 3 < 100:
		gray = cv2.bitwise_not(gray)
		threshed = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 10)
	else:
		threshed = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 10)
		threshed = cv2.bitwise_not(threshed)
	((cx, cy), (w, h), ang) = cv2.minAreaRect(cv2.findNonZero(threshed))
	if (bg_color[0] + bg_color[1] + bg_color[2]) / 3 < 100:
		ang = 0
	elif abs(math.ceil(ang)) >= 45:
		w, h = h, w
		ang -= 90
	if hh:
		ang = 0
	M = cv2.getRotationMatrix2D((cx,cy), ang, 1.0)
	rotated = cv2.warpAffine(threshed, M, (out2.shape[1], out2.shape[0]))
	rotated_colored = cv2.cvtColor(rotated, cv2.COLOR_GRAY2BGR)

	# Noise Removal
	denoised = cv2.fastNlMeansDenoisingColored(rotated_colored, None, 10, 10, 7, 15)

	if hh:
		erosion = cv2.erode(denoised, np.ones((1, 1),np.uint8), iterations = 1)
	else:
		erosion = denoised

	pil_im = cv2.cvtColor(erosion, cv2.COLOR_BGR2RGB)
	pil_out = Image.fromarray(pil_im)
	return pil_out

def main():
	image = apply_orientation(Image.open("images/tesseract_tests/ph1.jpg"))
	preprocess_tesseract(image).show()

if __name__ == "__main__":
	main()