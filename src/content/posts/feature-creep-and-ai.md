---
title: Feature Creep and AI
pubDate: 2026-07-21 08:57
---

For my meditation app ZenSpan I was considering adding a setting that would allow the user to set a volume level to start the meditation with. This would avoid the user having to change their volume before a meditation session. I came to the idea because before every meditation I start, I almost always adjust the volume.

Implementing this feature would be next to no work with the current state of AI in development tools. But after some consideration I decided the best action is no action.

## The Feature

Setting the volume at the start of a meditation would be very little effort. But what about all the edge cases? For example if the user adjusted their volume just before starting the meditation, should we still let the app override it? And what about when the meditation ends, should the volume be reset to the previous volume? What if the user adjusts the volume during the meditation? And this meditation volume, should the user be able to set it to zero? Should the home screen of the app somehow indicate that the volume is going to be adjusted?

None of these questions are technical, but I also think there is no single correct answer.

## The AI

I could discuss all these considerations with the AI and probably come up with a pretty good compromise on all the questions surrounding the feature. I or it could spend some time to implement and then test the known edge cases.

Considering this feature made me think about all these easy to add, no one clear solution, should be tested on actual hardware, features that come up in so many projects. It seems that the easier it becomes to build the feature, the better the reasoning should be before adding the functionality. In past work projects when a feature request came in, and there wasn't a straightforward solution, you could always balance the amount of effort it would take versus the clarity of the requirements and when the whole endeavour seemed too murky not build it at all. But when the friction of building it becomes near zero, the balance of the decision shifts.

The question whether it should be implemented at all has become a lot more important. The AI won't push back no matter how bad the implementation details get. Once I've invested time in it, how bad would it have to be before I would reconsider?

## The Conclusion

For ZenSpan, the volume level is already visible on the home screen; the user can adjust it before or during the meditation. Maybe the current situation is good enough.

But it made me wonder how much of my future work will hinge on these kinds of questions, as the cost of building keeps falling.
