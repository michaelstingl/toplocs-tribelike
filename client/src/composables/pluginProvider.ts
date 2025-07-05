import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import gun from '@/services/gun';
import { addPluginRoutes } from '@/router/plugins';

export function pluginProvider() {
  const plugins = ref<Plugin[]>([]);
  const routes = ref<Route[]>([]);
  const slots = ref<Slot[]>([]);
  const tabs = ref<Tab[]>([]);
  const router = useRouter();

  onMounted(async () => {
    // Check if we need to bootstrap plugins from manifest
    const manifestPlugins = (window as any).TRIBELIKE_PLUGIN_MANIFEST;
    if (manifestPlugins && manifestPlugins.length > 0) {
      console.log('🔌 Found plugin manifest, checking for each plugin in Gun...');
      
      // Check each manifest plugin individually
      for (const manifestPlugin of manifestPlugins) {
        await new Promise<void>((resolve) => {
          let timeout = setTimeout(() => {
            // Timeout = plugin doesn't exist
            console.log(`  ➕ Adding missing plugin: ${manifestPlugin.name}`);
            
            // Create the plugin with Gun references for arrays
            const pluginData = {
              name: manifestPlugin.name,
              url: manifestPlugin.url,
              paths: `${manifestPlugin.name}_paths`,
              slots: `${manifestPlugin.name}_slots`,
              tabs: `${manifestPlugin.name}_tabs`
            };
            
            // Store the plugin
            gun.get('plugins').get(manifestPlugin.name).put(pluginData);
            
            // Store paths array
            if (manifestPlugin.paths) {
              manifestPlugin.paths.forEach((path: any, index: number) => {
                gun.get(pluginData.paths).get(`path_${index}`).put(path);
              });
            }
            
            // Store slots array
            if (manifestPlugin.slots) {
              manifestPlugin.slots.forEach((slot: any, index: number) => {
                gun.get(pluginData.slots).get(`slot_${index}`).put(slot);
              });
            }
            
            // Store tabs array
            if (manifestPlugin.tabs) {
              manifestPlugin.tabs.forEach((tab: any, index: number) => {
                gun.get(pluginData.tabs).get(`tab_${index}`).put(tab);
              });
            }
            
            resolve();
          }, 300);
          
          gun.get('plugins').get(manifestPlugin.name).once((data) => {
            if (data && data.name) {
              console.log(`  ✓ Plugin already exists: ${manifestPlugin.name}`);
            } else {
              console.log(`  ➕ Adding new plugin: ${manifestPlugin.name}`);
              
              // Create the plugin with Gun references for arrays
              const pluginData = {
                name: manifestPlugin.name,
                url: manifestPlugin.url,
                paths: `${manifestPlugin.name}_paths`,
                slots: `${manifestPlugin.name}_slots`,
                tabs: `${manifestPlugin.name}_tabs`
              };
              
              // Store the plugin
              gun.get('plugins').get(manifestPlugin.name).put(pluginData);
              
              // Store paths array
              if (manifestPlugin.paths) {
                manifestPlugin.paths.forEach((path: any, index: number) => {
                  gun.get(pluginData.paths).get(`path_${index}`).put(path);
                });
              }
              
              // Store slots array
              if (manifestPlugin.slots) {
                manifestPlugin.slots.forEach((slot: any, index: number) => {
                  gun.get(pluginData.slots).get(`slot_${index}`).put(slot);
                });
              }
              
              // Store tabs array
              if (manifestPlugin.tabs) {
                manifestPlugin.tabs.forEach((tab: any, index: number) => {
                  gun.get(pluginData.tabs).get(`tab_${index}`).put(tab);
                });
              }
            }
            clearTimeout(timeout);
            resolve();
          });
        });
      }
      
      console.log('📦 Plugin manifest processing complete');
      
      // Re-run route registration after bootstrap
      console.log('🛣️ Registering plugin routes...');
      addPluginRoutes(router);
    }

    // Now load plugins from Gun as usual
    gun.get('plugins')
    .map()
    .once(plugin => {
      if (plugin) {
        plugins.value?.push(plugin);
        gun.get(plugin.paths)
        .map()
        .once(data => {
          if (data) {
            routes.value?.push(data);
          }
        });

        gun.get(plugin.slots)
        .map()
        .once(data => {
          if (data) {
            const slot = { plugin: plugin, ...data };
            slots.value?.push(slot);
          }
        });

        gun.get(plugin.tabs)
        .map()
        .once(data => {
          if (data) {
            tabs.value?.push(data);
          }
        });
      }
    });
  });

  onUnmounted(() => {
    plugins.value = [];
    routes.value = [];
    slots.value = [];
    tabs.value = [];
  });

  provide('plugin', {
    plugins,
    routes,
    slots,
    tabs,
  });
}

export function usePlugins() {
  const data = inject('plugin');

  if (!data) {
    throw new Error('Composable must have an plugin provider.');
  }

  return data;
}