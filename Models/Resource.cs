using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace CdnCatalog.Models
{
    public class Resource
    {
        public string Url { get; set; }
        public string Name { get; set; }
        public string Version { get; set; }

        public string Type
        {
            get
            {
                return Url.EndsWith(".js") ? "js" :
                    Url.EndsWith(".css") ? "css" : "";
            }
        }

        public string Host
        {
            get
            {
                if (Url.StartsWith("//ajax.googleapis")) return "Google";
                if (Url.StartsWith("//ajax.aspnetcdn")) return "Microsoft";
                if (Url.StartsWith("http://yui.yahooapis")) return "Yahoo";
                if (Url.StartsWith("http://o.aolcdn")) return "AOL";
                return "";
            }
        }

        public static IEnumerable<Resource> LoadAll(string filename)
        {
            var document = XDocument.Load(filename);

            var resourceElements = document.Element("resources").Elements("resource");
            foreach (var element in resourceElements)
            {
                yield return new Resource
                {
                    Url = element.Element("url").Value,
                    Name = element.Element("name").Value,
                    Version = element.Element("version").Value
                };
            }

            var loopElements = document.Element("resources").Elements("resource-loop");
            foreach (var element in loopElements)
            {
                var urlPattern = element.Element("url-pattern").Value;
                var version = element.Element("version").Value;
                var namePattern = element.Element("name-pattern").Value;
                var nameElements = element.Elements("name");
                foreach (var nameElement in nameElements)
                {
                    yield return new Resource
                    {
                        Url = string.Format(urlPattern, nameElement.Value),
                        Name = string.Format(namePattern, nameElement.Value),
                        Version = version
                    };
                }
            }
        }
    }
}