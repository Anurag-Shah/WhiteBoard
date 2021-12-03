
#############################################################################
# ocr_lang_detect.py
#
# Authors: Anurag
#
# Detects programming language of the code
#############################################################################

import ocr_utils

# detect
# Author: Anurag
# Return value: programming language
# Parameters:
#	1. code - code text
# This function is a wrapper for the entire OCR Process

import ocr_utils

def detect(code):
	language = ocr_utils.GLOBAL_GUESSER.language_name(code)
	if language not in ["C", "C++", "C#", "Java"]:
		return "C"
	return language

def main():
	print(detect('#include<stdio.h>\n\nint main(int argc, char *argv[]) {\nprintf ("Hello World") ;\nreturn 0;\n\n}'))
	print(detect("#include <iostream>\nint main() {\nstd::cout << \"Hello World\";\nreturn 0;\n}"))
	print(detect("namespace HelloWorld {\nclass Hello {\n static void Main(string[] args) {\nSystem.Console.WrieteLine(\"Hello World\");\n}\n}\n}"))
	print(detect("class HelloWorld {\npublic static void main(String[] args) {\nSystem.out.println(\"Hello World\");\n}\n}"))

if __name__ == "__main__":
	main()