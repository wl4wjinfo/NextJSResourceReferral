declare global {
  interface Window {
    radar: {
      initialize: (apiKey: string) => void;
      ui: {
        map: (options: {
          container: HTMLElement;
          style: 'light' | 'dark';
          center: {
            latitude: number;
            longitude: number;
          };
          zoom: number;
        }) => {
          addMarker: (options: {
            latitude: number;
            longitude: number;
            color: string;
            onClick?: () => void;
          }) => void;
          openPopup: (options: {
            latitude: number;
            longitude: number;
            html: string;
          }) => void;
          remove: () => void;
        };
      };
      search: {
        places: (options: {
          near: {
            latitude: number;
            longitude: number;
          };
          radius: number;
          chains: string[];
          limit: number;
        }) => Promise<{
          places: Array<{
            name: string;
            formattedAddress: string;
            location: {
              coordinates: [number, number];
            };
          }>;
        }>;
      };
    };
  }
}
