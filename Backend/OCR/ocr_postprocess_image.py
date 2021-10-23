
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

# ocr_postprocess
# Author: Anurag
# Return value: string of data
# Parameters:
#	1. image - image
# This function performs any postprocessing needed on image

def ocr_postprocess_image(image):
	image = np.array(image)
	image = image[:, :, ::-1].copy()
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	th, threshed = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV|cv2.THRESH_OTSU)
	pts = cv2.findNonZero(threshed)
	ret = cv2.minAreaRect(pts)
	(cx, cy), (w, h), ang = ret
	if w > h:
	    w,h = h,w
	    ang += 90
	M = cv2.getRotationMatrix2D((cx,cy), ang, 1.0)
	rotated = cv2.warpAffine(threshed, M, (image.shape[1], image.shape[0]))
	hist = cv2.reduce(rotated,1, cv2.REDUCE_AVG).reshape(-1)
	th = 2
	H,W = image.shape[:2]
	uppers = [y for y in range(H-1) if hist[y] <= th and hist[y + 1] > th]
	lowers = [y for y in range(H-1) if hist[y] > th and hist[y + 1] <= th]
	rotated = cv2.cvtColor(rotated, cv2.COLOR_GRAY2BGR)
	for y in uppers:
	    cv2.line(rotated, (0,y), (W, y), (255,0,0), 1)
	for y in lowers:
	    cv2.line(rotated, (0,y), (W, y), (0,255,0), 1)
	cv2.imwrite("result.png", rotated)
	# Next steps are to perform these operations on parallel with our grayscale image and our color image

if __name__ == "__main__":
	test_im_path = "images/tesseract_tests/"
	test_im = "test2"
	imsuffix = ".png"
	print(ocr_postprocess_image(Image.open(test_im_path + test_im + imsuffix).convert('RGB')))