# Examples using Pillow on IBM i

This example manipulates a [picture](https://commons.wikimedia.org/wiki/File:4-Week-Old_Netherlands_Dwarf_Rabbit.JPG) of an adorable Netherlands Dwarf Rabbit and the IBM i logo using the Python [Pillow](https://python-pillow.org/) library. It demonstrates:

- Resizing the image in half
- Resizing the image to a fixed size
- Resizing the image to fit inside a fixed size, but keeping the aspect ratio the same (thumbnailing)
- Croping the image
- Pasting one image on top of the other (watermarking)

# Installing requisites
 - **Pillow:** `yum install python3-Pillow`

# Running the Examples
```python3 ./pillow-rabbit.py```

# More Info

- [Pillow documentation](http://pillow.readthedocs.io/en/4.3.x/), specifically the [Image class](http://pillow.readthedocs.io/en/4.3.x/reference/Image.html)