# NetBox device type and device

- **Kind:** Primary
- **URL:** https://netboxlabs.com/docs/netbox/models/dcim/devicetype/ and
  https://netboxlabs.com/docs/netbox/models/dcim/device/
- **Read:** 2026-10-27
- **Used by:** hardware record structure (model facts vs unit facts)

## Device type

- "A device type represents a particular make and model of hardware that
  exists in the real world."
- "Device types are instantiated as devices installed within sites and/or
  equipment racks."

Documented fields: Manufacturer, Model, Slug, Default Platform, Part Number,
Height, Is Full Depth, Parent/Child Status, Airflow, Cooling Method, Weight,
End of Life, Front & Rear Images.

## Device

- "Every piece of hardware which is installed within a site or rack exists
  in NetBox as a device."
- Serial Number: "The unique physical serial number assigned to this device
  by its manufacturer."
- Asset Tag: "A unique, locally-administered label used to identify hardware
  resources."

Other documented fields include Name, Role, Device Type, Location, Status,
Platform, Configuration Template.
