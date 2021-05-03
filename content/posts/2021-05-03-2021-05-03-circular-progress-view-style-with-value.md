---
title: CircularProgressViewStyle with value in SwiftUI
date: 2021-05-03 13:30
description: Creating a ProgressViewStyle in SwiftUI that shows the progress based on the provided value
---

The `ProgressView` in SwiftUI comes in two different distinct view styles (plus a default style):

1. `LinearProgressViewStyle`
2. `CircularProgressViewStyle`

The `CircularProgressViewStyle` is the well known iOS spinner, but what if we want to use this `ProgressView` style to indicate progress.

With SwiftUI view style modifiers, we can implement this ourselves. Here are the two SwiftUI styles and below is the new `ProgressViewStyle` we are creating, all controlled by a Slider:

![CircularWithValueProgressViewStyle](/images/2021-05-03/CircularWithValueProgressViewStyle.gif)

## Creating a ProgressViewStyle

To create a `ProgressViewStyle` we have to define a `struct` that adopts the `ProgressViewStyle` protocol. Adopting this protocol will require us to implement a `makeBody` function in which we can build our own view.

To create the base for our new progress view, we can render petals using multiple `Capsule` views. For every petal we increase the rotation so we get a flow like effect. To make sure we can place the petals in the right place relative to each other we will place them inside a `ZStack`.

```swift
struct CircularWithValueProgressViewStyle: ProgressViewStyle {
    private let petals = 8

    func makeBody(configuration: Configuration) -> some View {
        GeometryReader { geometry in
            ZStack {
                ForEach(0..<petals) { index in
                    VStack {
                        Capsule()
                            .fill(Color(.systemGray2))
                            .frame(width: geometry.size.width / 8, height: geometry.size.height / 3)
                            .offset(y: -geometry.size.width / 3)
                            .rotationEffect(.degrees(Double(360 / petals * index)))
                    }
                    .frame(width: geometry.size.width, height: geometry.size.height)
                }
            }
        }
        .frame(width: 20, height: 20)
    }
}
```

To use this new ProgressViewStyle, we would apply it to any ProgressView by adding the modifier `.progressViewStyle()`.

```swift
ProgressView(value: 0.8)
    .progressViewStyle(CircularWithValueProgressViewStyle())
```

The above code will render a static view without the progress. The next step will be to add the ability to show the progress.

![Static ProgressViewStyle shows rendered petals](/images/2021-05-03/ProgressViewStyle-static.png)

## Showing progress

The `ProgressView` from SwiftUI allows users to either provide a value from 0 to 1, or provide a value in combination with a total. Inside the View these values will be converted to a fraction completed (from 0 to 1). We can access this completion value in the `Configuration` provided to the `makeBody`: `configuration.fractionCompleted`.

```swift
ProgressView(value: 0.8) // fractionCompleted will be 0.8
ProgressView(value: 80, total: 100) // fractionCompleted will also be 0.8
```

With the `fractionCompleted` we can use the index of each petal to determine whether the petal is visible. Because we have an exact value, we can also use opacity to indicate when the fraction is inbetween two petals. The following function will calculate the opacity based on the index and the completion.

```swift
private func petalOpacity(for index: Int, completed: Double?) -> Double {
    guard let completed = completed else {
        return 0.0
    }
    let petalFraction = 1 / Double(petals)
    let petalCompleted = completed - petalFraction * Double(index)

    return max(0, min(1, petalCompleted * Double(petals)))
}
```

To avoid returning a value less than 0 or greater than 1, the result is passed into the `max` and `min` functions.

We can now apply this opacity to the `Capsule` for each petal by adding the `.opacity()` modifier.

```swift
Capsule()
    .opacity(petalOpacity(for: index, completed: configuration.fractionCompleted))
```

Which will look like this for 80% completion.

![ProgressViewStyle adds opacity to show completion](/images/2021-05-03/ProgressViewStyle-opacity.png)

## Adding animation when progress at 100%

To make it extra clear to the user that the `ProgressView` is at 100%, we can add animation.

What we could do is add the following modifiers to the `GeometryReader` view.

```swift
.rotationEffect(.degrees(configuration.fractionCompleted ?? 0 >= 1 ? 360 : 0))
.animation(configuration.fractionCompleted ?? 0 >= 1 ? .linear.speed(0.1).repeatForever(autoreverses: false) : .linear)
```

This will work when the progress value is updated from anywhere below `1` to `1`. But if our new view style is initialized at `1`, it would not start rotating. The reason for this behaviour is that the rotation effect will then start at 360 and never change. For SwiftUI to animate these values, the framework will need to have a start and end value to animate between. One value in the above case is not enough.

To fix this situation, we can store whether we are animating in a `@State` variable which will always start as false, so we can trigger the animation no matter what the start value is.

We can add this state value in `CircularWithValueProgressViewStyle` like any other SwiftUI state:

```swift
@State private var isAnimating = false
```

This `isAnimating` state needs to be updated when the value of `configuration.fractionCompleted` changes. And in order to make sure that the view can also start animating when we initialize with value `1.0`, we will also set the `isAnimating` variable in the `.onAppear()` of our `ProgressViewStyle`.

```swift
.onAppear {
    isAnimating = configuration.fractionCompleted ?? 0 >= 1
}
.onChange(of: configuration.fractionCompleted, perform: { value in
    withAnimation {
        isAnimating = value ?? 0 >= 1
    }
})
```

Now we can add the animation like before, but with the `isAnimating` variable.

```swift
.rotationEffect(.degrees(isAnimating ? 360 : 0))
.animation(isAnimating ? .linear.speed(0.1).repeatForever(autoreverses: false) : .linear)
```

## Show the ProgressView label

The SwiftUI `ProgressView` also supports providing a label, up till now we have ignored this. But to add it to our new `ProgressViewStyle` is straightforward.

By wrapping the `GeometryReader` inside a `VStack`, we can put the label in the view by adding `configuration.label`.

```swift
VStack {
    GeometryReader { geometry in
        // ...
    }

    configuration.label
        .foregroundColor(Color.gray)
}
```

This will look like the image below.

![ProgressViewStyle with provided label](/images/2021-05-03/ProgressViewStyle-label.png)

## The complete CircularWithValueProgressViewStyle

Everything put together gives us the following `ProgressViewStyle`:

```swift
struct CircularWithValueProgressViewStyle: ProgressViewStyle {
    private let petals = 8

    @State private var isAnimating = false

    func makeBody(configuration: Configuration) -> some View {
        VStack {
            GeometryReader { geometry in
                ZStack {
                    ForEach(0..<petals) { index in
                        VStack {
                            Capsule()
                                .fill(Color(.systemGray2))
                                .opacity(petalOpacity(for: index, completed: configuration.fractionCompleted))
                                .animation(isAnimating ? .linear : .none)
                                .frame(width: geometry.size.width / 8, height: geometry.size.height / 3)
                                .offset(y: -geometry.size.width / 3)
                                .rotationEffect(.degrees(Double(360 / petals * index)))
                        }
                        .frame(width: geometry.size.width, height: geometry.size.height)
                    }
                }
            }
            .frame(width: 20, height: 20)
            .rotationEffect(.degrees(isAnimating ? 360 : 0))
            .animation(isAnimating ? .linear.speed(0.1).repeatForever(autoreverses: false) : .linear)
            .onAppear {
                isAnimating = configuration.fractionCompleted ?? 0 >= 1
            }
            .onChange(of: configuration.fractionCompleted, perform: { value in
                withAnimation {
                    isAnimating = value ?? 0 >= 1
                }
            })

            configuration.label
                .foregroundColor(Color.gray)
        }
    }

    private func petalOpacity(for index: Int, completed: Double?) -> Double {
        guard let completed = completed else {
            return 0.0
        }
        let petalFraction = 1 / Double(petals)
        let petalCompleted = completed - petalFraction * Double(index)

        return max(min(petalCompleted * Double(petals), 1), 0)
    }
}
```
