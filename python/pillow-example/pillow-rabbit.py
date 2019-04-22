#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from PIL import Image

img = Image.open('rabbit.jpg')
logo = Image.open('ibmi.png')

# Resize the image to exactly half its width and height
half_size = [ dim//2 for dim in img.size ]
half_img = img.resize(half_size)
half_img.save('rabbit_half.jpg')

# Resize the image to 512x512, disregarding aspect ratio 
small_size = [ 512, 512 ]
small_img = img.resize(small_size)
small_img.save('rabbit_512x512.jpg')

# Make a thumbnail, keeping the same aspect ratio
# where the length and width are 534 pixels max
max_size = (534, 534)
small_img = img.copy()
small_img.thumbnail(max_size)
small_img.save('rabbit_thumb.jpg')

# Use the smaller image from here on out
img = small_img

# Crop the image
# upper left x,y; lower right x,y
box = (0, 160, 356, 460)
small_img = img.crop(box)
small_img.save('rabbit_crop.jpg')


# Add an IBM i watermark to the rabbit
position = ( \
(img.width - logo.width - 5), \
(img.height - logo.height - 5))

marked_image = img.copy()
marked_image.paste(logo, position, logo)
marked_image.save('rabbit_watermarked.jpg')
