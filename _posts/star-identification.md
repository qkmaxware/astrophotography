---
title: "Star Identification in Images"
series: Plate solver programming
---
So now that the software understands what an image is, we can actually start on the first step of plate solving. Identifying stars. With images just being a 3D matrix of numbers it can be hard to do plate solving if we don't know what part of the image is a star. 

The image in figure 1 below is what I used as a test image for this star identification process. It's not a great image for actually plate solving (parts of it have been rearranged to move the galaxy to the top left corner so it isn't impeded by my webcam when used as a Zoom virtual background) but for the purposes of star identification this will serve just fine. 

The image itself contains a large galaxy, a lot of noise, and and imperfections that make it a less than ideal photo but really good for seeing how effective my algorithm would end up. 

{% include figure.html id="before" src="test.jpeg" caption="Image used for testing star identification." %}

Ok, the first thing that I am going to do is to remove some of that noise from the image. This could also help with nebulosity or amp glow. There are a lot of possible ways to do this but I am going to do a "median subtraction". For each channel in the pixel data I will compute the median value using the algorithm described in pseudocode below. Then all the pixel values in that channel will have the median subtracted from the value. For example, if the median was 6 and a pixel had a value of 10 for that channel then it's new value would be 4. However, if the pixel has a value smaller than 6 for that channel then the number will be 0 as the value can never be negative.

```py
def median(channel)
    pixels = getPixelsInChannel(channel)
    sort(pixels)
    return pixels[(len(pixels) + 1) / 2]
```
<figcaption>Pseudocode for computing the median of an array of pixel values for one channel by first sorting the pixels and then picking an element near the middle. This is not the fastest method for computing the median but it is the simplest to code.</figcaption>

Once we have subtracted the median of each channel away that should help with some of the noise. Now the next thing to do is to find out what pixels **might** be a part of a star. I'll just call these significant pixels. Visually we are trying to separate bright spots of the image (which are likely to be stars) from the dim parts of the image (the black of the sky) The simplest approach would be to create a linear discriminant. If a pixel value is greater than a certain value then it's bright enough to be a part of a star, if its below that value then its too dim. This will definitely work but if images have different max or min values then maybe things could be missed. Another approach would be to compute those max and min values and then pick a value that only covers the brightest 10% of pixels or so. This is a better approach then just choosing a value randomly. I decided on a slightly different logic. I sample the image every 6 or so pixels and compute an average. Since in an image of the sky most of the pixels will represent "space" most of these sampled pixels will be of space. Then I average the values to create a value that is partially indicative of the remaining "noise" in the image. This noise factor is then scale them up by constant factor and if a pixel's value is greater than that scaled up value then the pixel is significant. The figure below shows the image with the significant pixels highlighted in red. 

{% include figure.html id="significant" before_src="test.jpeg" after_src="test.significant_pixels.jpeg" caption="Pixels that are considered significant (in the image's red channel) highlighted in red." %}

Based on the figure above, we can see that the significant pixels for the most part do represent the stars. This logically makes sense since stars are brighter than the remaining sky and significant pixels represent the bright pixels. For my algorithm, this significant pixel selection is done on a "per-channel" basis. That way hot pixels in one colour channel can be ignored as a sensor defect. 

With the significant pixels identified these need to be transformed from independent pixels into collections of pixels which represent stars. Once again there are many different ways to do this. For simplicity's sake, I will use the flood-fill algorithm. Pick on of the significant pixels, then search outwards from that pixel adding all connected significant pixels together into one set. Continue adding pixels to the set until none of the neighboring pixels are significant. This process is repeated until all significant pixels are a part of at most 1 set. In essence, what I am doing is no different then using the paint bucket tool in any image editing software. Choose the paint bucket tool, and click the inside of a star and watch how far it fills. Then click another star, and another until you've clicked all stars and each one has been filled in. 

These sets of significant pixels can then be filtered. If a set is too small, such as only containing a single pixel, then it is probably noise and should be ignored. If a set is too large, it could be a galaxy or nebula feature and not a single star so we can also ignore these ones. Choosing good max and min sizes is subject to experimentation. I choose no max size, and a min size of 2x2 pixels in this experiment. 

The sets that remain can be assumed to be stars. Compute the center of the set, perhapses by averaging all pixel locations as vector coordinates, and compute an approximate radius for the star on the image by detecting the furthest pixel in the set from the center of the set. The figure below shows the resulting detected stars using this approach. 

{% include figure.html id="after" src="test.stars.jpeg" caption="Final image after stars have been identified from the significant pixels." %}

So far, I am pretty satisfied with the resulting detection. It seems like most of the stars were detected, as far as I can tell. I should play around with the max size of significant pixel sets so that it doesn't capture the galaxy as a "star". I might also want to play around with the significant pixel value threshold since some stars that are close together are being marked as all a part of a single star. Lastly, I will need to work on performance of the algorithm as it takes around 4 minutes to compute these detected stars for the image which is 1920x1080 pixels of data. That's quite slow given that most plate solving applications can do the entire plate solving (or fail to) in that same amount of time. I am sure there are numerous areas where my code could be improved for greater performance. The median computation is of particular interest for me given that it requires sorting the value of all pixels before the median can be returned. But those are things to improve later and right now my code does identify stars which is what it is intended to do. The 3 rules of coding: first it has to work, then it has to be maintainable, and lastly performant. 

And that's it for this part. Shocking complex to make a computer do a task that a human can do visually almost instantly. 