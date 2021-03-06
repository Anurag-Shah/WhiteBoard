from django.test import TestCase

# Create your tests here.

from compiler_wrapper import compiler_wrapper
from ocr_lang_detect import detect

class CompilerTestCase(TestCase):
	def setUp(self):
		self.c_execute = '#include<stdio.h>\n\nint main(int argc, char *argv[]) {\nprintf ("Hello World") ;\nreturn 0;\n\n}'
		self.c_error = '#incelude<stdio.h>\n\nint main(int argc, char *argv[]) {\nprintf ("Hello World") ;\nreturn 0;\n\n}'
		self.cpp_execute = "#include <iostream>\nint main() {\nstd::cout << \"Hello World\";\nreturn 0;\n}"
		self.cpp_error = "#incelude <iostream>\nint main() {\nstd::cout << \"Hello World\";\nreturn 0;\n}"
		self.cs_execute = "namespace HelloWorld {\nclass Hello {\n static void Main(string[] args) {\nSystem.Console.WriteLine(\"Hello World\");\n}\n}\n}"
		self.cs_error = "namespeace HelloWorld {\nclass Hello {\n static void Main(string[] args) {\nSystem.Console.WriteLine(\"Hello World\");\n}\n}\n}"
		self.java_execute = "class HelloWorld {\npublic static void main(String[] args) {\nSystem.out.println(\"Hello World\");\n}\n}"
		self.java_error = "clases HelloWorld {\npublic static void main(String[] args) {\nSystem.out.println(\"Hello World\");\n}\n}"

	def test_c(self):
		lang = detect(self.c_execute)
		out1 = compiler_wrapper(self.c_execute, lang)
		out2 = compiler_wrapper(self.c_error, lang)
		self.assertEqual(lang, "C")
		while out1[0] == '':
			out1 = compiler_wrapper(self.c_execute, lang)
		while out2[0] == '':
			out2 = compiler_wrapper(self.c_error, lang)
		self.assertEqual(out1[0], "Hello World")
		self.assertEqual(out1[1], [])
		self.assertNotEqual(out2[0], "Hello World")

	def test_cpp(self):
		lang = detect(self.cpp_execute) 
		out1 = compiler_wrapper(self.cpp_execute, lang)
		out2 = compiler_wrapper(self.cpp_error, lang)
		self.assertEqual(lang, "C++")
		while out1[0] == '':
			out1 = compiler_wrapper(self.cpp_execute, lang)
		while out2[0] == '':
			out2 = compiler_wrapper(self.cpp_error, lang)
		self.assertEqual(out1[0], "Hello World")
		self.assertEqual(out1[1], [])
		self.assertNotEqual(out2[0], "Hello World")

	def test_cs(self):
		lang = detect(self.cs_execute)
		out1 = compiler_wrapper(self.cs_execute, lang)
		out2 = compiler_wrapper(self.cs_error, lang)
		self.assertEqual(lang, "C#")
		self.assertEqual(out1[0], "Hello World\n")
		self.assertEqual(out1[1], [])
		self.assertNotEqual(out2[0], "Hello World\n")

	def test_java(self):
		lang = detect(self.java_execute)
		out1 = compiler_wrapper(self.java_execute, lang)
		out2 = compiler_wrapper(self.java_error, lang)
		self.assertEqual(lang, "Java")
		self.assertEqual(out1[0], "Hello World\n")
		self.assertEqual(out1[1], [])
		self.assertNotEqual(out2[0], "Hello World\n")