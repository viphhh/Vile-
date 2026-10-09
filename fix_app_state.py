import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix isFetching -> loadingHotels
content = content.replace("{isFetching ? (", "{loadingHotels ? (")

# Fix CustomerDashboard missing props
old_dashboard = """                <CustomerDashboard
                  user={user}
                  bookings={bookings}
                  inquiries={inquiries}
                  favorites={favorites}
                  hotels={publicHotels}
                  priceAlerts={priceAlerts}
                  onLogout={handleLogout}
                  onNavigateHome={() => setActiveTab('home')}
                  onRemoveFavorite={toggleFavorite}
                  onCancelBooking={handleCancelBooking}
                  onSimulateEmail={setSimulatedEmailBooking}
                  onSelectHotel={(h) => setSelectedHotel(h)}
                />"""

new_dashboard = """                <CustomerDashboard
                  user={user}
                  bookings={bookings}
                  inquiries={inquiries}
                  favorites={favorites}
                  hotels={publicHotels}
                  priceAlerts={priceAlerts}
                  onLogout={handleLogout}
                  onNavigateHome={() => setActiveTab('home')}
                  onRemoveFavorite={toggleFavorite}
                  onCancelBooking={handleCancelBooking}
                  onSimulateEmail={setSimulatedEmailBooking}
                  onSelectHotel={(h) => setSelectedHotel(h)}
                  onOpenPriceAlert={handleOpenPriceAlert}
                  onSimulatePriceDrop={handleSimulatePriceDrop}
                />"""
content = content.replace(old_dashboard, new_dashboard)

with open("src/App.tsx", "w") as f:
    f.write(content)
