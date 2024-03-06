---
title: Table row styling with CSS Grid
pubDate: 2024-02-24 06:40
---

Recently I was creating a table layout with `CSS Grid` but when searching how to style even / odd row backgrounds, the suggestions online were pretty outdated. Since `subgrid` support has become [widely available](https://caniuse.com/css-subgrid), I think there are better solutions.

## An example table

<div class="table rounded shadow-md border border-stone-200 dark:border-stone-700">
  <div class="row">
    <div>Programming Language</div>
    <div>Creator</div>
    <div>First Release</div>
  </div>
  <div class="row">
    <div>C</div>
    <div>Dennis Ritchie</div>
    <div>1972</div>    
  </div>
  <div class="row">
    <div>Python</div>
    <div>Guido van Rossum</div>
    <div>1991</div>
  </div>
  <div class="row">
    <div>JavaScript</div>
    <div>Brendan Eich</div>
    <div>1995</div>
  </div>
</div>

## The code

To create the table above, we can use the HTML:

```html
<div class="table">
  <div class="row">
    <div>Programming Language</div>
    <div>Creator</div>
    <div>First Release</div>
  </div>
  <div class="row">
    <div>C</div>
    <div>Dennis Ritchie</div>
    <div>1972</div>    
  </div>
  <!-- [...additional rows] -->
</div>
```

And the styling to make it into a table:

```css
.table {
  display: grid; 
  grid-template-columns: repeat(3, 1fr); /* 3 columns of even width */
}
.row {
  display: grid; 
  grid-template-columns: subgrid; /* Every row is a subgrid */
  grid-column: 1 / -1; /* Spans from the first to the last column */
}
.row:first-of-type {
  font-weight: bold;
}
.row:nth-of-type(even) {
  background-color: white; /* Even rows get alternative background-color */
}
```

The code above is a very simplified example, but with `CSS Grid` and `subgrid` the options for creating advanced layouts are almost limitless.

<style type="text/css">
.table {
  display: grid; 
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1em;
  min-width: min-content;
}
.row {
  display: grid; 
  grid-template-columns: subgrid; 
  grid-column: 1 / -1;
  padding-inline: 0.5em;
  padding-block: 0.25em;
}
.row:first-of-type {
  font-family: sans-serif;
  font-weight: bold;
}
.row:nth-of-type(even) {
  background-color: rgb(231, 229, 228);
}
@media (prefers-color-scheme: dark) {
  .row:nth-of-type(even) {
    background-color: rgb(68, 64, 60);
  }
}
</style>