---
title: "Introduction to plate solving"
series: Plate solver programming
---
# What is "Plate Solving"?
Plate solving is a technique use in astronomy to determine what part of the sky is imaged by a particular photo. In modern astronomy this technique is mainly used in computer aided control to direct a telescope to a particular area of the sky with high precision. If the telescope reports that it is pointing to a different position than a photo taken through the telescope then software can correct for this and move the telescope to the correct position. 

This was not always the case though, plate solving was done entirely by humans. Humans would have to perform measurements on an image, taken on a type of photographic glass plate, and manually compare them to a star catalogue. It is from these glass plates that the name plate solving comes about. 

In general, plate solving is not an overly complex idea. However, there are quite a few different steps involved. Each of these steps can pose quite an interesting problem for computers and programmers to solve. As such, I have decided to write my own plate solving software to better understand the complexities and to provide others with a better understanding of their internal workings. This series serves that purpose. However, before we can write any code we first have to understand exactly how a plate solver works.

# How does Plate Solving work?
As stated earlier plate solving is not overly complex. There are only a few steps and one can easily understand the logic behind what each step is trying to do. I should also note that there is a difference between a blind plate solver and a local plate solver. 

Blind plate solvers do not make any assumptions about where the image was taken. They are required to have a deep understanding of the whole sky and the relationships between the stars. Astronomy.net is an example of a blind plate solver. 

Local plate solvers are similar but they start with an idea of where the photo was taken, these initial guesses usually come from the telescope's computerized mount. Then the local solver starts at those initial coordinates and scans outwards from there looking for a more accurate solution.

This means that local plate solvers tend to be faster than blind plate solvers simply because they usually have to do less work. However, a local plate solver is more prone to failure; especially if the initial guess was quite inaccurate. 

In either case, the majority of the steps of plate solving are the same with only minor differences between them.

## Star Identification
The first step of a plate solver is to take an image and be able to identify the stars from the image. A human can do this quite easily as our brains are very good at contextualizing information and recognizing patterns. However, for a computer this is not an easy task. To a computer an image is simply a sequence of numbers, it has no context for what it is looking at. Additionally, images can contain details like light pollution, amp glow, nebula features, hot pixels, or other sources of noise that make it hard for a computer to detect what is a star and what is not. 

## Asterism Creation
Once we have the stars detected in the image it is time to create asterisms from those stars. An asterism is just a complex term used to mean a pattern of stars that are not constellations. Basically we are creating a bunch of geometric shapes from the stars we detected in the first step. Technically, we are matching these shapes and not the stars themselves. This is because, shapes have more information which we can match between images and star catalogues. With two identical shapes, we can determine how one is scaled compared to the other, how one is offset from the other, or even how one is rotated with respect to the other. A star though is just a point, it has not more information. 

Most plate solver implementations these days turn these asterisms into what they call "hashes". Unique sequences of numbers that remain consistent for each shape. A common method is to make asterisms of 4 stars, and then the hash for that asterism is the distances between each star (in the image), normalized between 0 and 1. 

## Catalogue Comparison
The next step is to take those asterisms, or hashes and compare them against a catalogue of stars. This is where blind plate solvers and local plate solvers differ. 

For a blind plate solver, the entire sky must be converted into their own asterisms which can be compared to those from the image. Since blind plate solvers need to maintain these asterisms for the whole sky they usually require pre-computation of what are called inverse indexes and they take up a lot of storage on a server or in a database. For a local plate solver we create a "virtual camera", project the stars onto that virtual camera's surface create asterisms, then compare them to the ones from the image. If none match then we move the virtual camera a little and try again. This process is repeated until a match is found or the search is too far from the initial coordinates. 

I should note here, that a local plate solver can act similar to a blind plate solver **if** we don't impose a limit on the search's distance from the initial coordinates. This tends to increase computation time immensely though. 

## Frame of Reference Computation
Now we have a bunch of asterisms, some from the image we've taken, and some from the star catalogue. Usually we would like to have at least 3 asterisms match between the star catalogue and the image. By comparing the two set we can determine the difference in rotation, offset, and scale between them. If the catalogue asterisms are tagged with additional information like right-ascension and declination then we can use that information to compute the right-ascension and declination coordinates for the center of the image. 

That's it, plate solving in a nutshell. Of course, each step is much more complex than the simple descriptions provided here but I'll leave the details for the later articles in the series. 