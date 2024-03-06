---
title: Table row styling with CSS Grid
pubDate: 2024-02-24 06:40
---

Recently I ran into styling issues with a table layout where a lot of columns had to take the minimum amount of space, so certain other columns could take all the room available. The default `table` styling in CSS is not very flexible, so it would be great to use CSS Grid row such a layout. But with a normal CSS Grid layout you will not have the option to easily style even / odd row backgrounds. When searching how to style even / odd row backgrounds, the suggestions online were pretty outdated. Since `subgrid` support has become [widely available](https://caniuse.com/css-subgrid), I think there are better solutions.

## An example table

<table class="rounded shadow-md border border-stone-200 dark:border-stone-700">
  <thead>
    <tr>
      <th>Programming Language</div>
      <th>Creator</div>
      <th>First Release</div>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>C</td>
      <td>Dennis Ritchie</td>
      <td>1972</td>
    </tr>
    <tr>
      <td>Python</td>
      <td>Guido van Rossum</td>
      <td>1991</td>
    </tr>
    <tr>
      <td>JavaScript</td>
      <td>Brendan Eich</td>
      <td>1995</td>
    </tr>
  </tbody>
</table>

## The code

To create the table above, we can use the HTML:

```html
<table>
  <thead>
    <tr>  
      <th>Programming Language</th>
      <th>Creator</th>
      <th>First Release</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>C</td>
      <td>Dennis Ritchie</td>
      <td>1972</td>
    </tr>
    <!-- [...additional rows] -->
  </tbody>
</table>
```

And the styling to make it into a CSS Grid based table:

```css
table {
  display: grid; 
  grid-template-columns: repeat(3, 1fr); /* 3 columns of even width */
}
thead, tbody, tr {
  display: grid; 
  grid-template-columns: subgrid; /* thead, tbody and tr are subgrid */
  grid-column: 1 / -1; /* from the first to the last column */
}
thead tr, tbody tr:nth-of-type(even) {
  background-color: white; /* the header and even rows get alternative background-color */
}
th {
  font-weight: bold;
}
```

The code above is a very simplified example, but with `CSS Grid` and `subgrid` the options for creating advanced table layouts are almost limitless.

<style type="text/css">
table {
  display: grid; 
  grid-template-columns: repeat(3, 1fr);
}
thead, tbody, tr {
  display: grid; 
  grid-template-columns: subgrid; 
  grid-column: 1 / -1;
}
tr {
  padding-inline: 0.5em;
  padding-block: 0.25em;
}
thead tr, tbody tr:nth-of-type(even) {
  background-color: rgb(231, 229, 228);
}
th {
  text-align: start;
  font-family: sans-serif;
  font-weight: bold;
}
@media (prefers-color-scheme: dark) {
  thead tr, tr:nth-of-type(even) {
    background-color: rgb(68, 64, 60);
  }
}
</style>