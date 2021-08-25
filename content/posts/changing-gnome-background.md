---
layout: post
title: Changing the GNOME Shell login background
date: April 13, 2020
author: Álvaro José Agámez Licha
overview: The "problem" is that I was just tired of the boring purple Ubuntu's background login screen, I REALLY was tired of it, so I asked myself, how can I change the login screen background?, and the quick answer was, no you can't change it, the long answer was, well, you can change it, but this involves dealing with the GNOME Shell CSS.
permalink: changing-the-gnome-shell-login-background.html
tags:
- gnome
- bash
---

The "problem" is that I was just tired of the boring purple Ubuntu's background login screen, I REALLY was tired of it, so I asked myself, how can I change the login screen background?, and the quick answer was, no you can't change it, the long answer was, well, you can change it, but this involves dealing with the GNOME Shell CSS.

Changing your GNOME Shell login background is not complicated if you know what to change and where to make the change. The change consists of modifying the CSS file with the desired image, but in my case, I wanted to change this image every time that I restart my laptop, and I want to download the daily [Bing](https://www.bing.com/) image to use it as background.

I'm using Ubuntu 19.10, so to change the login background I need to modify the file `/usr/share/gnome-shell/theme/Yaru/gnome-shell.css`, if you are using another distro or Ubuntu version, please search for the correct path on internet, but my path can give you an idea of where to start looking.

Inside this CSS file, we need to modify the selector `#lockDialogGroup` from

```css
#lockDialogGroup {
  background: #4f194c url(noise-texture.png);
  background-repeat: repeat; }
```

to

```css
#lockDialogGroup {
  background-image: url(file:///path/to/your/image.ext);
  background-repeat: no-repeat;
  background-size: cover;;
  background-position: center; 
}
```

First at all, I tried to found an easy way to change every day the login background in an automatic way, but changing a CSS file every day is not a trivial task just with bash, and if I made a mistake, all my shell could be broken (trust me, that happened like 5 times while I was making manual tests and fortunately was not broken enough to be able to fix it).

After thinking for a few minutes, I realized that I could create a symbolic link to the daily image and change this symbolic link to point to a different image every day, and use this symbolic link in the CSS file, voilà, the first problem was resolved.

The command to create a symbolic link is the next:

```bash
ln -s ./path/to/your/real_file.ext ./path/to/your/fake_file.ext
```

Let's move on to the next problem, this problem is randomly choosing a daily image, for this, I had to make some internet research because I'm not a bash wizard, but the trick actually is simple, we can use the `shuf` command, this command ***"Write a random permutation of the input lines to standard output"***, great, this looks like the perfect tool for the task, and what can we use as input? well, the perfect tool for this task is `ls` command.

```bash
ls ./the/path/to/your/backgrounds/**/*.ext | shuf -n 30 | shuf -n 1
```

If you need to select different file types according to the extension, you could use something like this:

```bash
ls ./path/**/* | egrep '\.jpg$|\.jpeg$|\.png$|\.gif$' | shuf -n 30 | shuf -n 1
``` 

If you are wondering why I use the `shuf` command twice, this is to achieve a higher level of randomness; first I choose 30 random items and after that, I choose 1 random item from the previous group.

Up to this point, we have almost solved the first part of the problem, we just need to run our script every time our PCs are restarted, for this I decided to use `crontab` with the `@reboot` modifier.

```bash
@reboot /path/to/your/script.sh
```

Please don't forget to give your script execution privileges:

```bash
sudo chmod +x /path/to/your/script.sh
```

Now we have all the necessary parts to fulfill the first task, so its time to have a complete script, in my case I put it in  `/etc/init.d/download-bing-background.sh`

```bash
#!/bin/bash

# General values for the script
SOURCE=./the/path/to/your/backgrounds
DAILY_LOGIN_BACKGROUND=daily-login-background.jpg
VIRTUAL_FILENAME=$SOURCE/$DAILY_LOGIN_BACKGROUND

# Change the extension according to your needs
filename=$(ls $SOURCE/**/*.jpg | shuf -n 30 | shuf -n 1)

# Check if the symbolic link exists, if exists, delete it
if test -f "$VIRTUAL_FILENAME"; then
  rm $VIRTUAL_FILENAME
fi

ln -s $filename $VIRTUAL_FILENAME

echo Daily login background: $filename
```

Now we are automatically changing the login background every time we restart our PCs, the next step is to download the daily image from [Bing](https://www.bing.com/). This is not a big problem with Node.js or PHP (my two main backend languages), but I wanted to solve this with bash only, so the complexity of the task was increased.

Again, I'm not a bash wizard, but I'm super stubborn, and I really wanted to solve this problem using just bash and at the same time, learn more about bash programming.

To get the daily [Bing](https://www.bing.com/) exists an endpoint that can give you the last 8 images (or just one) in [XML](https://www.bing.com/HPImageArchive.aspx?format=xml&idx=0&n=1) or [JSON](https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1) format, but again, process `XML` or `JSON` just with bash tools is not a trivial task, I could just install some extra tools to do it, but not, I wanted to do it just with bash, so after some extra thinking and research, the chosen tool
for the task was... regular expressions.

![Everybody stands back I know regular expressions](https://image.slidesharecdn.com/regexp-dm-131205173718-phpapp02/95/regular-expressions-javascript-and-beyond-1-638.jpg)

I know, I know, some people always say that when you have a problem and you solve it using regular expressions, now you have two problems, but in this case, I think it is the right tool for the problem.  But how the hell can you use regular expressions in bash?, I was asking me the same, but again after some research, I found that with the `sed` command you can do it.

So the first step was to download the `JSON` file, for this `CURL` come to the rescue:

```bash
# Download the JSON file into a variable
json=$(curl -s $BING_IMAGES_URL)
```

After having the JSON, you just have to get the necessary values:

```bash
# Get the url and name from the JSON
image_url=$(echo $json | sed -n 's|.*"url":"\([^"]*\)".*|\1|p')
image_name=$(echo $image_url | sed -n 's|.*?id=\(.*\)&rf.*|\1|p')
```

And now we can download the image to our PCs using `CURL` again:

```bash
curl -s /path/to/your/images/folder -o /name/of/the/downloaded/image.ext
```

Now let's put all the pieces together, in my case I put all the code in  `./etc/init.d/download-bing-background.sh`:

```bash
#!/bin/bash

# General values for the script
BING_DOMAIN="https://www.bing.com"
BING_IMAGES_URL="https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1"
DESTINATION=/path/to/your/background/directory
CURRENT_DIRECTORY=$(date +%Y)-$(date +%m)
DOWNLOAD_DIRECTORY=$DESTINATION/$CURRENT_DIRECTORY

echo Image Destination: $DOWNLOAD_DIRECTORY

# Download the JSON file into a variable
json=$(curl -s $BING_IMAGES_URL)

# Get the url and name from the JSON
image_url=$(echo $json | sed -n 's|.*"url":"\([^"]*\)".*|\1|p')
image_name=$(echo $image_url | sed -n 's|.*?id=\(.*\)&rf.*|\1|p')

echo Downloading image of the day: $image_name

# Check if the download directory exists or nor
if [ ! -d $DOWNLOAD_DIRECTORY ]; then
  mkdir $DOWNLOAD_DIRECTORY
fi

# Check if the image already exists
if [ -f $DOWNLOAD_DIRECTORY/$image_name ]; then
  echo Image already exists, skipping.
else
  curl -s $BING_DOMAIN/$image_url -o $DOWNLOAD_DIRECTORY/$image_name
fi
```

Please don't forget to give your script execution privileges:

```bash
sudo chmod +x /path/to/your/script.sh
```

Ok, this is all folks, I hope you enjoyed and learned how I did by solving this "problem" I had with Ubuntu.

If you have some questions, please send me a message on [Twitter](https://twitter.com/aagamezl).
