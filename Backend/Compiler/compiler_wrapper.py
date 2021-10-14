
#############################################################################
# compiler_wrapper.py
#
# Authors: Anurag
#
# Provides a wrapper interface for the compiler process
# This includes programming language detection
#############################################################################

# ocr_wrapper
# Author: Anurag
# Return value: string of data
# Parameters:
#	1. input - tuple of text to combine and language
# This function is a wrapper for the entire Compiler Process

import subprocess

def compiler_wrapper(input):
	if input[1] == "C":
		with open("compile.c", "w") as outfile:
			outfile.write(input[0])
		subprocess.call(['sh', './compile_c.sh'])
		with open("compile.c", "w") as outfile:
			outfile.write("")
	else:
		print("Language Not Supported")

if __name__ == "__main__":
	# Testing function for pipeline
	compiler_wrapper(('#include<stdio.h>\n\nint main(int argc, char *argv[]) {\nprintf ("Hello World") ;\nreturn 0;\n\n}', "C"))