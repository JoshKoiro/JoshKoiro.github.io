#!/bin/bash
# downloadedFile="C:\\Users\\JKoiro\\Downloads\\josh koiro - resume-html.zip"
downloadedFile="D:\\Downloads\\josh koiro - resume html.zip"
destinationDirectory="$PWD"
echo $downloadedFile

# check if file has been downloaded
if [[ -s "$downloadedFile" ]]; then
    echo "File has been downloaded. Copying to destination directory..."
    cp "$downloadedFile" "$destinationDirectory"
    echo "File copied successfully."
else
    echo "File has not been downloaded. No code to update."
    exit 1
fi

unzip -o "josh koiro - resume-html.zip"
rm "josh koiro - resume-html.zip"
rm  "$downloadedFile"
read -p "Would you like to deploy to Github? (y/n) " deploy


# Convert the deploy variable to lowercase for case-insensitive comparison
deploy=${deploy,,}

if [[ "$deploy" == "y" ]]; then
    echo "committing and pushing to github."
    git add .
    git c
    git push
elif [[ "$deploy" == "n" ]]; then
    echo "local repository updated. Code not deployed."
else
    echo "Invalid input. Please enter 'y' or 'n'."
fi