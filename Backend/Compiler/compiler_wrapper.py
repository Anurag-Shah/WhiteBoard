
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
#	1. compiler_input - text input
#	2. language - programming language
# This function is a wrapper for the entire Compiler Process

import subprocess
import os

def compiler_wrapper(compiler_input, language):
	line_numbers = []
	if language == "C":
		with open("compile.c", "w") as outfile:
			outfile.write(compiler_input)
		proc = subprocess.run(['sh', './compile_c.sh'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
		with open("compile.c", "w") as outfile:
			outfile.write("")
		os.remove("compile.c")
		if (os.path.exists("a.out")):
			os.remove("a.out")
		out_text = str(proc.stdout)
		out_text = out_text.replace("./compile_c.sh: 2: ./a.out: not found\n", "")
		matches = re.findall("compile\.c:[0-9]+:[0-9]+:", out_text)
		for match in matches:
			temp_m = match.replace("compile.c:", "")
			temp_m = temp_m.split(':')
			if int(temp_m[0]) not in line_numbers:
				line_numbers += [int(temp_m[0])]
		return out_text, line_numbers
	else:
		"Language Not Supported"
	return None, None

if __name__ == "__main__":
	# Testing function for pipeline
	print(compiler_wrapper('#include<stdio.h>\n\nint main(int argc, char *argv[]) {\nprintf ("Hello World") ;\nreturn 0;\n\n}', "C"))
