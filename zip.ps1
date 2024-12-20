$PathObject = Get-Location -PSDrive C
$Path = $PathObject.Path

$files = @(
	".\css", 
	".\module", 
	".\packs", 
	".\resources", 
	".\templates", 
	".\utils", 
	".\README.md", 
	".\eslint.config.cjs", 
	".\package-lock.json", 
	".\.prettierrc.cjs", 
	".\.prettierignore", 
	".\package.json", 
	".\system.json", 
	".\template.json"
)

Compress-Archive -Path $files -DestinationPath "$Path\system.zip" -Update
