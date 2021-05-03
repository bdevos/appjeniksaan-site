---
title: Some other post
date: 2021-03-20 18:00
description: Description of this post
---

This is another post to test with ordering and stuff 💩

> Here is a quote of some text that is written here. Should some special styling happen with this, or does it not really matter?
>
> Plus another sentence in the quote...

Some Swift code:

```swift
struct SpinnerProgressViewStyle: ProgressViewStyle {
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
