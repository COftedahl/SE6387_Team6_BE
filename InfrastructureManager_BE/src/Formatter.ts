const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour12: false, 
  year: "2-digit", 
  month: "2-digit", 
  day: "2-digit", 
  hour: "2-digit", 
  minute: "2-digit", 
  second: "2-digit", 
});

export default formatter;