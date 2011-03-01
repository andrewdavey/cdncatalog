using System.Linq;
using System.Web.Mvc;
using CdnCatalog.Models;

namespace CdnCatalog.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var resources = Resource.LoadAll(Server.MapPath(@"~\App_Data\resources.xml"));
            return View(
                resources
                    .OrderByDescending(r => r.Type)
                    .ThenBy(r => r.Type == "css" ? r.Host : r.Name)
                    .ToArray()
            );
        }

    }
}
