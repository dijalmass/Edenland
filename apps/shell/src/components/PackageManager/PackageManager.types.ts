export interface Package {
  name: string;
  version: string;
  description: string;
  repository: string;
  is_installed: boolean;
}

export interface PackageDetails extends Package {
  dependencies: string[];
  size: string;
  download_size: string;
  url: string;
  maintainer: string;
  license: string;
  architecture: string;
  build_date: string;
  install_date: string;
  groups: string[];
}
