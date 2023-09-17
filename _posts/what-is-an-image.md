---
title: "What is an Image"
series: Plate solver programming
---
While one would assume that I would start my work on building a plate solver with the first step discussed in the last part, "star identification", that is actually not where the complexity begins. The first complexity that needs to be resolved is one that would, to most people, seem to be a non-issue. What is an image?

Intuitively, a person knows what an image is. Images permeate our daily lives wether they are images we take on our cell phone cameras or pictures we see while browsing the internet. For us an image is a picture of something, a rectangular thing that shows us something we can see with our own eyes. To a computer however, it doesn't have eyes, it doesn't have any context to understand what an image is. It is up to software written by humans to tell a computer how to understand what an image is. 

Making this even more complex is that fact there are dozens, if not hundreds of image file formats. Some formats are extremely common and well know. Formats like JPEG, PNG, and GIF are super common. Other formats are non common at all, being only used by small groups of individuals or being used purely for research purposes. Formats like this include TIFF, TARGA, PPM, and (for astronomy) FITS. For each of these formats, someone needs to write software that can read the data stored in the image file and draw it correctly on the screen for us to view it. 

Ok so there are huge numbers of file formats and some are not very popular so software to read them might be hard to come by. Is the number of formats the only complexity? Well, no. Images can be colour or black and white. There are different colour spaces such as NCS, Adobe, and sRGB. A colour space organizes the colours so that they can be accurately reproduced by a computer. Additionally how colours are represented within these spaces change as well. Sometimes a colour is represented as a triple of red, green, and blue values or as hue, saturation, and value, or maybe we are looking at cyan, magenta, and yellow values instead. And that is only the complexity for drawing an image on the screen for you to see it. But to a computer it still has no idea as to the context of the image. 

Ok so how am I going to approach the idea of images? Namely I will reduce the problem and abstract the problem's details away from the actual task of plate solving. What I mean by this is that I will create a simple concept of what an image is that throws away the ideas of colour spaces, pixel representations, and even the idea that it is an image. Then abstract away the complexities of file formats and assume that if someone wants a particular format to work with my plate solver they will make a their own software to read the images and convert them to the image concept I use. This make things easier on me since I don't need to worry about all the different file formats and instead and just do my work on a single representation. This also makes it quite flexible because, to add a support for a new image file type. we only need to add a converter from a format to the internal format.

```
JPEG ->
PNG  ->
GIF  ->
BMP  ->  My Internal Format -> plate solving results
...  ->
TIFF ->
FITS ->
```
<figcaption>Representation of image file format loading for this plate solver.</figcaption>

So my concept of an image goes something like this.

For my plate solver, and image is simply a multi-dimensional matrix of positive integers. The first dimension is called the channel. A black and white image would have only 1 channel. A rgb image would have 3 channels; one for red, one for green, and one for blue. The other 2 dimensions are x and y. So a value positioned in dimension 1, x position 10, and y position 5 would be the numeric value for the red component of a pixel on the image 10 from the left and 5 down. Each value must be positive because you can't have less than none of a particular component. In terms of programming languages, we can represent the matrix using arrays and we can use unsigned integers to represent the positive only values. This does limit us to a max value of 4294967295 per channel, per pixel; this shouldn't be an issue given that for many common image formats each component (red, blue, green) can only have a max values of 255. The structure of the image, written in a C-like pseudo code, is as follows:

```c
struct ChannelData {
    uint[][] Values;
}
struct ImageData {
    ChannelData[] Channels;

    uint GetPixelValue(Channel c, int x, int y) {
        return Channels[c]->Values[x][y];
    }
}
```
<figcaption>C-like pseudocode for the internal representation of an image.</figcaption>

Now that my software knows what in image is, it is just a 3d array of unsigned integers, I can actually start on the real steps of the plate solver. Which I'll save for the next part. 