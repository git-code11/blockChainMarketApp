import sys
import json
import secrets


def run(inputFile, ouputFile, keyField, valueField):
	dataIn = json.load(inputFile)
	#print(dataIn)
	dataOut = dict(
					map(lambda token:[token[keyField],token[valueField]], dataIn)
				)
	json.dump(dataOut, ouputFile, indent=4)


def main():

	inputFileName = sys.argv[1]
	outputFileName = secrets.token_hex(4) + inputFileName

	keyField = sys.argv[2]
	valueField = sys.argv[3]

	inputFile = open(inputFileName)
	outputFile = open(outputFileName, 'w')

	print("Extracting Data...")
	
	with inputFile as iFile:
		with outputFile as oFile:
			run(iFile, oFile, keyField, valueField)
	
	print(f"Task Completed: {outputFileName}")


if __name__ == "__main__":
	if( (len(sys.argv) > 1 and sys.argv[1] == "-h") or len(sys.argv) != 4):
		print("Usage: extract.py filename keyField valueField")
	else:
		main()


