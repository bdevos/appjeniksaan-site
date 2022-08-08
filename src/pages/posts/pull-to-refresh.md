---
title: Pull to Refresh in SwiftUI
pubDate: 2021-05-04 07:00
description: Creating a Pull to Refresh ScrollView in SwiftUI
layout: ../../layouts/Post.astro
---

### Deprecation warning

2021-06-11: Please be aware that with the introduction of iOS 15 and the SwiftUI additions for 2021, this functionality is build into SwiftUI: [refreshable(action:)](<https://developer.apple.com/documentation/SwiftUI/View/refreshable(action:)>)

---

Yesterday I wrote an article about creating a [CircularProgressView which could show the progress](/posts/2021/05/03/circular-progress-view-style-with-value). Today I wanted to write about how you could use that `ProgressViewStyle` in creating a ScrollView with pull to request functionality.

I wanted to create this pull to refresh functionality after [reading about tracking the scroll offset](https://swiftwithmajid.com/2020/09/24/mastering-scrollview-in-swiftui/) in the `ScrollView`.

![CircularWithValueProgressViewStyle](/images/pull-to-refresh/pull-to-refresh.gif)

## Using a PreferenceKey to track offset in ScrollView

To track the offset in the ScrollView we need to introduce a `PreferenceKey`.

```swift
private struct OffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = .zero

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {}
}
```

Which we can then use to track the offset from a `GeometryReader` in the background of a `ScrollView`.

```swift
ScrollView(.vertical) {
    content
        .background(
            GeometryReader { geometry in
                Color.clear
                    .preference(
                        key: OffsetPreferenceKey.self,
                        value: geometry.frame(in: .named("pullToRefresh")).origin.y
                    )
            }
        )
}
.coordinateSpace(name: "pullToRefresh")
.onPreferenceChange(OffsetPreferenceKey.self, perform: { _ in })
```

The `content` in the code above comes from a `@ViewBuilder` that we will initialize our view with. To track the offset, the next step is to implement the function that is triggered by `.onPreferenceChange()`.

## Show indicator when refresh will be triggered

To show the user how much further he has to move the `ScrollView` to trigger a refresh, we can use the `ProgressView` in an overlay with the [`CircularWithValueProgressViewStyle`](/posts/2021/05/03/circular-progress-view-style-with-value). The value of the `ProgressView` can be stored in a `@State` variable. This way we can update the value based on the change in our `OffsetPreferenceKey`.

```swift
@State private var progress: Double = .zero

ScrollView(.vertical) {
    // ...
}
.overlay(ProgressView(value: progress).progressViewStyle(CircularWithValueProgressViewStyle()), alignment: .top)
.onPreferenceChange(OffsetPreferenceKey.self, perform: { offset in
    progress = // ... Calculate based on offset
})
```

## Creating a PullToRefeshView

The new view we are creating should act similar to a `ScrollView`. We can achieve that by using a `@ViewBuilder` to provide the content to the view.

We also want to make sure that the `PullToRefeshView` does not know about any of the logic to actually refresh. We can do this by adding a callback function to our view. The callback will be called once the user has triggered the refresh. The callback also should provide another function as a parameter that allows the containing view to signal that it is done.

```swift
PullToRefreshView() {
    Text("Pull to Refresh")
} onRefresh: { done in
    // Here refresh action can be implemented
    // And should call `done()` once it has completed
}
```

To implement this in a view introduces a new `@State` variable to store whether the view is refreshing.

For the `done` function we want to return on the `onRefresh`, we can use a `typealias` to make it a bit easier to read. Both functions are [`@escaping`](https://www.donnywals.com/what-is-escaping-in-swift/) because it can perform asynchronous work.

```swift
struct PullToRefreshView<Content: View>: View {
    typealias DoneFunction = () -> Void // Make it easier to type the return function

    private let onRefresh: (@escaping DoneFunction) -> Void
    private let content: Content

    @State private var isRefreshing = false
    @State private var progress: Double = .zero

    init(
        @ViewBuilder content: () -> Content,
        onRefresh: @escaping (@escaping DoneFunction) -> Void
    ) {
        self.onRefresh = onRefresh
        self.content = content()
    }

    var body: some View {
        ScrollView(.vertical) {
            content

            // ...
        }
        .onPreferenceChange(OffsetPreferenceKey.self, perform: onOffsetChange)
    }

    private func onOffsetChange(offset: CGFloat) {
        progress = calculateProgress(from: offset)

        if !isRefreshing && offset > 100 {
            isRefreshing = true

            // Here we call back to the provided onRefresh function
            // The 1 argument we pass is what the done function in `onRefresh: { done in`
            onRefresh({
                isRefreshing = false
            }
        }
    }

    private func calculateProgress(from offset: CGFloat) -> Double {
        if isRefreshing || offset >= 100 {
            return 1
        } else if offset <= 0 {
            return 0
        } else {
            return Double(offset / 100)
        }
    }
```

## Finalizing the view

In the above code most of the functionality is there, but to finish up we can add a a few features:

1. Minimum distance: To only show the progress indicator once a certain threshold has been passed
2. Haptic feedback: To let the user know that the view has started with refreshing
3. Offset the `ScrollView`: To make sure that the `ProgressView` does not overlap with the content of the `ScrollView` we should add some offset to the top

## PullToRefreshView

The final code for our `PullToRefreshView` will then look like this.

```swift
private struct OffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = .zero

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {}
}

struct PullToRefreshView<Content: View>: View {
    typealias DoneFunction = () -> Void // Make it easier to type the return function

    private let refreshDistance: CGFloat = 100
    private let offsetWhileLoading: CGFloat = 36
    private let coordinateSpaceName = "pullToRefresh"

    private let feedbackGenerator = UIImpactFeedbackGenerator(style: .medium)

    private let minimumDistance: CGFloat
    private let onRefresh: (@escaping DoneFunction) -> Void
    private let content: Content

    @State private var isRefreshing = false
    @State private var progress: Double = .zero

    init(
        minimumDistance: CGFloat = 10,
        @ViewBuilder content: () -> Content,
        onRefresh: @escaping (@escaping DoneFunction) -> Void
    ) {
        self.minimumDistance = minimumDistance
        self.onRefresh = onRefresh
        self.content = content()
    }

    var body: some View {
        ScrollView(.vertical) {
            content
                .background(
                    GeometryReader { geometry in
                        Color.clear
                            .preference(
                                key: OffsetPreferenceKey.self,
                                value: geometry.frame(in: .named(coordinateSpaceName)).origin.y
                            )
                    }
                )
                .offset(y: isRefreshing ? offsetWhileLoading : 0)
        }
        .coordinateSpace(name: coordinateSpaceName)
        .overlay(ProgressView(value: progress).progressViewStyle(CircularWithValueProgressViewStyle()), alignment: .top)
        .onPreferenceChange(OffsetPreferenceKey.self, perform: onOffsetChange)
    }

    private func onOffsetChange(offset: CGFloat) {
        DispatchQueue.main.async {
            progress = calculateProgress(from: offset)

            if !isRefreshing && offset > refreshDistance {
                withAnimation(.easeOut) {
                    isRefreshing = true
                }

                feedbackGenerator.impactOccurred()

                onRefresh({
                    withAnimation {
                        isRefreshing = false
                    }
                })
            }
        }
    }

    private func calculateProgress(from offset: CGFloat) -> Double {
        if isRefreshing || offset >= refreshDistance {
            return 1
        } else if offset <= minimumDistance {
            return 0
        } else {
            return Double(offset / refreshDistance)
        }
    }
}
```

The following view was used to create the above GIF.

```swift
struct ContentView: View {
    static private let initialNames = ["Jarl", "Ehecatl", "Jayanti", "Surendra", "Medeia"]

    @State var names = ContentView.initialNames

    var body: some View {
        PullToRefreshView() {
            Text("Names").font(.system(.largeTitle, design: .rounded))
                .padding()
            Divider()

            ForEach(names, id: \.self) { name in
                Text(name).padding()
            }
        } onRefresh: { done in
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0, execute: {
                withAnimation {
                    names.insert(contentsOf: ["Nephele", "Vesta"], at: 0)
                }

                done()

                DispatchQueue.main.asyncAfter(deadline: .now() + 3.0, execute: {
                    withAnimation {
                        names = ContentView.initialNames
                    }
                })
            })
        }
    }
}
```
