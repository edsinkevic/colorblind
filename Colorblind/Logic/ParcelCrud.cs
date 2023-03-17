using Logic.Models;

namespace Logic;

public class ParcelCrud
{
        private readonly IParcelDao _parcelDao;

        public ParcelCrud(IParcelDao parcelDao)
        {
                _parcelDao = parcelDao;
        }

        public Parcel GetParcel(string code)
        {
                return _parcelDao.FetchParcel(code);
        }
}

public interface IParcelDao
{
        public Parcel FetchParcel(string code);
}
