// import {LicenseManager} from "ag-grid-enterprise";
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';
// components
import { StyledChart } from './components/chart';
import SnackbarProvider from './components/snackbar';
import { ThemeSettings } from './components/settings';
import { MotionLazyContainer } from './components/animate';

// LicenseManager.setLicenseKey("CompanyName=Odinbi,LicensedApplication=Odinbi,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-031976,SupportServicesEnd=24_August_2023_[v2]_MTY5MjgzMTYwMDAwMA==d592c0a523adf2f61c33653512491b81");
// ----------------------------------------------------------------------

export default function App() {
  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <ThemeLocalization>
            <SnackbarProvider>
              <StyledChart />
              <Router />
            </SnackbarProvider>
          </ThemeLocalization>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
