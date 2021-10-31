
#############################################################################
# ocr_postprocess_image.py
#
# Authors: Anurag
#
# Performs postprocess on the (preprocessed) input image for OCR
#############################################################################

import ocr_utils
from ocr_utils import OCRError
import cv2							#opencv-python
import numpy as np
from PIL import Image
import math
import collections

ZERO = [0, 10]
PLUS_ONE = [1, 9]
PLUS_TWO = [2, 3, 7, 8]
PLUS_THREE = [4, 5, 6]
MINUS_ONE = [11, 19]
MINUS_TWO = [12, 13, 17, 18]
MINUS_THREE = [14, 15, 16]

# ocr_postprocess
# Author: Anurag
# Return value: string of data
# Parameters:
#	1. input_image - image
# This function performs any postprocessing needed on image

def ocr_postprocess_image(input_image, line_numbers):
	pil_w, pil_h = input_image.size
	image = np.array(input_image)
	image = image[:, :, ::-1].copy()
	out_image = image.copy()
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	__, threshed = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
	((cx, cy), (w, h), ang) = cv2.minAreaRect(cv2.findNonZero(threshed))
	if abs(math.ceil(ang)) >= 45:
		w, h = h, w
		ang -= 90
	output_ang = ang

	M = cv2.getRotationMatrix2D((cx,cy), ang, 1.0)
	rotated = cv2.warpAffine(threshed, M, (image.shape[1], image.shape[0]))

	bg_color = detect_background_color(out_image)
	rotated_out = cv2.warpAffine(out_image, M, (out_image.shape[1], out_image.shape[0]), borderValue=bg_color)

	hist = cv2.reduce(rotated, 1, cv2.REDUCE_AVG).reshape(-1)
	diff_thresh = 2
	H,W = image.shape[:2]
	uppers = [y for y in range(H - 1) if hist[y] <= diff_thresh and hist[y + 1] > diff_thresh]
	lowers = [y for y in range(H - 1) if hist[y] > diff_thresh and hist[y + 1] <= diff_thresh]
	rotated = cv2.cvtColor(rotated, cv2.COLOR_GRAY2BGR)
	left_coords = []
	i = 0
	for y in lowers:
		if (i in line_numbers):
			#cv2.line(rotated_out, (0, y + math.floor(pil_h / 200)), (W, y + math.floor(pil_h / 200)), (0, 0, 255), 1)
			left_coords += [y]
		i += 1
	transfer_to_pil = cv2.cvtColor(rotated_out, cv2.COLOR_BGR2RGB)
	pil_out = Image.fromarray(transfer_to_pil)

	for y_left in left_coords:
		phase = 0				# Ranges from 0 to 19
		for i in range(pil_out.size[0]):
			if phase == 20:
				phase = 0
			pix = (0, 0)
			if phase in ZERO:
				pix = (i, y_left)
			elif phase in PLUS_ONE:
				pix = (i, y_left + 1)
			elif phase in PLUS_TWO:
				pix = (i, y_left + 2)
			elif phase in PLUS_THREE:
				pix = (i, y_left + 3)
			elif phase in MINUS_ONE:
				pix = (i, y_left - 1)
			elif phase in MINUS_TWO:
				pix = (i, y_left - 2)
			else:
				pix = (i, y_left - 3)
			pil_out.putpixel(pix, (255, 0, 0))
			phase += 1
	pil_out.show()
	pil_out.save("test.png")

# detect_background_color
# Author: Anurag
# Return value: 3 tuple of integers for color code
# Parameters:
#	1. image - image (opencv2)
# This function computes background image by either finding most common (> 50%) color or by averaging the 
# other most common colors (in case there is a gradient)

def detect_background_color(image):
	img = image
	manual_count = {}
	w, h, channels = img.shape
	total_pixels = w * h
	for y in range(0, h):
		for x in range(0, w):
			RGB = (img[x, y, 2], img[x, y, 1], img[x, y, 0])
			if RGB in manual_count:
				manual_count[RGB] += 1
			else:
				manual_count[RGB] = 1
	number_counter = collections.Counter(manual_count).most_common(20)
	percentage_of_first = (float(number_counter[0][1]) / total_pixels)
	if percentage_of_first > 0.5:
		return (int(number_counter[0][0][0]), int(number_counter[0][0][1]), int(number_counter[0][0][2]))
	else:
		red = 0
		green = 0
		blue = 0
		sample = 10
		for top in range(0, sample):
			red += number_counter[top][0][0]
			green += number_counter[top][0][1]
			blue += number_counter[top][0][2]

		average_red = math.floor(red / sample)
		average_green = math.floor(green / sample)
		average_blue = math.floor(blue / sample)
		return (int(average_red), int(average_green), int(average_blue))

if __name__ == "__main__":
	test_im_path = "images/tesseract_tests/"
	test_im = "test_tall_2"
	imsuffix = ".jpg"
	#test_im = "test2"
	#imsuffix = ".png"
	print(ocr_postprocess_image(Image.open(test_im_path + test_im + imsuffix).convert('RGB'), [0, 2, 5]))