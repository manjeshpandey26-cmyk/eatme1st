import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Home,
  Mail,
  MapPin,
  Phone,
  Plus,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  useAddDeliveryAddress,
  useDeleteDeliveryAddress,
  useGetCallerUserProfile,
  useGetDeliveryAddresses,
  useSaveUserProfile,
  useSetDefaultDeliveryAddress,
  useUpdateDeliveryAddress,
} from "../hooks/useBackend";
import type { DeliveryAddress, UserProfile } from "../types";

// ── Profile Form ──────────────────────────────────────────────────────────

function ProfileForm({ profile }: { profile: UserProfile | null }) {
  const [form, setForm] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
  });
  const [dirty, setDirty] = useState(false);
  const save = useSaveUserProfile();

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const set = (field: keyof UserProfile, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setDirty(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save.mutate(form, {
      onSuccess: () => {
        toast.success("Profile saved!");
        setDirty(false);
      },
      onError: () => toast.error("Failed to save profile"),
    });
  };

  return (
    <Card
      className="bg-card border border-border rounded-2xl overflow-hidden"
      data-ocid="profile.form_card"
    >
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <User className="w-4 h-4 text-primary" />
        <h2 className="font-semibold font-display text-foreground">
          Personal Info
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              className="pl-9 bg-background"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              data-ocid="profile.name_input"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              className="pl-9 bg-background"
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              data-ocid="profile.email_input"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="phone"
            className="text-sm font-medium text-foreground"
          >
            Phone
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              className="pl-9 bg-background"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              data-ocid="profile.phone_input"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={!dirty || save.isPending}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
          data-ocid="profile.save_button"
        >
          {save.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}

// ── Address Card ──────────────────────────────────────────────────────────

function AddressCard({
  address,
  index,
  onSetDefault,
  onDelete,
  onEdit,
}: {
  address: DeliveryAddress;
  index: number;
  onSetDefault: (id: bigint) => void;
  onDelete: (id: bigint) => void;
  onEdit: (a: DeliveryAddress) => void;
}) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-smooth ${address.isDefault ? "border-primary/40 bg-primary/5" : "border-border bg-background"}`}
      data-ocid={`profile.address.${index}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${address.isDefault ? "bg-primary/15" : "bg-muted"}`}
      >
        <Home
          className={`w-4 h-4 ${address.isDefault ? "text-primary" : "text-muted-foreground"}`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-foreground truncate">
            {address.addressLabel}
          </span>
          {address.isDefault && (
            <Badge
              className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-0"
              data-ocid={`profile.default_badge.${index}`}
            >
              <Star className="w-2.5 h-2.5 mr-1" />
              Default
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {address.street}, {address.city}, {address.state} {address.zipCode}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {!address.isDefault && (
            <button
              type="button"
              className="text-xs text-primary font-medium hover:underline"
              onClick={() => onSetDefault(address.id)}
              data-ocid={`profile.set_default_button.${index}`}
            >
              Set as default
            </button>
          )}
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onEdit(address)}
            data-ocid={`profile.edit_address_button.${index}`}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-xs text-destructive hover:text-destructive/80 transition-colors flex items-center gap-0.5 ml-auto"
            onClick={() => onDelete(address.id)}
            data-ocid={`profile.delete_address_button.${index}`}
          >
            <Trash2 className="w-3 h-3" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Address Form ──────────────────────────────────────────────────────────

type AddressFormData = {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

const EMPTY_ADDRESS: AddressFormData = {
  label: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
};

function AddressForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: AddressFormData & { id?: bigint };
  onSave: (data: AddressFormData & { id?: bigint }) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<AddressFormData>(initial ?? EMPTY_ADDRESS);
  const set = (f: keyof AddressFormData, v: string) =>
    setForm((prev) => ({ ...prev, [f]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: initial?.id });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 bg-muted/40 rounded-xl border border-border"
      data-ocid="profile.address_form"
    >
      <div className="space-y-1">
        <Label className="text-xs font-medium text-foreground">
          Label (e.g. Home, Work)
        </Label>
        <Input
          className="h-8 text-sm bg-background"
          placeholder="Home"
          value={form.label}
          onChange={(e) => set("label", e.target.value)}
          required
          data-ocid="profile.address_label_input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-medium text-foreground">Street</Label>
        <Input
          className="h-8 text-sm bg-background"
          placeholder="123 Main St"
          value={form.street}
          onChange={(e) => set("street", e.target.value)}
          required
          data-ocid="profile.address_street_input"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1 space-y-1">
          <Label className="text-xs font-medium text-foreground">City</Label>
          <Input
            className="h-8 text-sm bg-background"
            placeholder="San Francisco"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            required
            data-ocid="profile.address_city_input"
          />
        </div>
        <div className="col-span-1 space-y-1">
          <Label className="text-xs font-medium text-foreground">State</Label>
          <Input
            className="h-8 text-sm bg-background"
            placeholder="CA"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            required
            data-ocid="profile.address_state_input"
          />
        </div>
        <div className="col-span-1 space-y-1">
          <Label className="text-xs font-medium text-foreground">ZIP</Label>
          <Input
            className="h-8 text-sm bg-background"
            placeholder="94102"
            value={form.zipCode}
            onChange={(e) => set("zipCode", e.target.value)}
            required
            data-ocid="profile.address_zip_input"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isSaving}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex-1"
          data-ocid="profile.address_save_button"
        >
          {isSaving ? "Saving…" : "Save Address"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="rounded-lg"
          data-ocid="profile.address_cancel_button"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ── Addresses Section ─────────────────────────────────────────────────────

function AddressesSection() {
  const { data: addresses, isLoading } = useGetDeliveryAddresses();
  const addAddress = useAddDeliveryAddress();
  const updateAddress = useUpdateDeliveryAddress();
  const deleteAddress = useDeleteDeliveryAddress();
  const setDefault = useSetDefaultDeliveryAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(
    null,
  );

  const handleAdd = (data: AddressFormData & { id?: bigint }) => {
    addAddress.mutate(
      {
        label: data.label,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
      {
        onSuccess: () => {
          toast.success("Address added!");
          setShowForm(false);
        },
        onError: () => toast.error("Failed to add address"),
      },
    );
  };

  const handleUpdate = (data: AddressFormData & { id?: bigint }) => {
    if (!editingAddress || data.id === undefined) return;
    updateAddress.mutate(
      {
        id: editingAddress.id,
        addressLabel: data.label,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        isDefault: editingAddress.isDefault,
      },
      {
        onSuccess: () => {
          toast.success("Address updated!");
          setEditingAddress(null);
        },
        onError: () => toast.error("Failed to update address"),
      },
    );
  };

  const handleDelete = (id: bigint) => {
    deleteAddress.mutate(id, {
      onSuccess: () => toast.success("Address removed"),
      onError: () => toast.error("Failed to remove address"),
    });
  };

  const handleSetDefault = (id: bigint) => {
    setDefault.mutate(id, {
      onSuccess: () => toast.success("Default address updated"),
      onError: () => toast.error("Failed to update default"),
    });
  };

  return (
    <Card
      className="bg-card border border-border rounded-2xl overflow-hidden"
      data-ocid="profile.addresses_card"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h2 className="font-semibold font-display text-foreground">
            Delivery Addresses
          </h2>
        </div>
        {!showForm && !editingAddress && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground h-8 rounded-lg"
            onClick={() => setShowForm(true)}
            data-ocid="profile.add_address_button"
          >
            <Plus className="w-3 h-3" />
            Add Address
          </Button>
        )}
      </div>

      <div className="px-5 py-5 space-y-3">
        {isLoading && <LoadingSpinner size="sm" label="Loading addresses…" />}

        {addresses && addresses.length === 0 && !showForm && (
          <div
            className="text-center py-6 text-muted-foreground"
            data-ocid="profile.addresses_empty_state"
          >
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No saved addresses yet</p>
          </div>
        )}

        {addresses?.map((addr, i) =>
          editingAddress?.id === addr.id ? (
            <AddressForm
              key={addr.id.toString()}
              initial={{
                label: addr.addressLabel,
                street: addr.street,
                city: addr.city,
                state: addr.state,
                zipCode: addr.zipCode,
                id: addr.id,
              }}
              onSave={handleUpdate}
              onCancel={() => setEditingAddress(null)}
              isSaving={updateAddress.isPending}
            />
          ) : (
            <AddressCard
              key={addr.id.toString()}
              address={addr}
              index={i + 1}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
              onEdit={(a) => {
                setEditingAddress(a);
                setShowForm(false);
              }}
            />
          ),
        )}

        {showForm && (
          <AddressForm
            onSave={handleAdd}
            onCancel={() => setShowForm(false)}
            isSaving={addAddress.isPending}
          />
        )}
      </div>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center min-h-[60vh]"
          data-ocid="profile.loading_state"
        >
          <LoadingSpinner size="lg" label="Loading profile…" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-6">
          <div className="max-w-xl mx-auto flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold font-display text-foreground truncate">
                {profile?.name || "Your Profile"}
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                {profile?.email || "Manage your account"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProfileForm profile={profile ?? null} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <AddressesSection />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
