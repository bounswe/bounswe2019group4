package com.example.arken.fragment;

import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.example.arken.R;
import com.example.arken.activity.MainActivity;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import static android.content.Context.MODE_PRIVATE;
import static androidx.navigation.fragment.NavHostFragment.findNavController;
import static com.example.arken.fragment.LoginFragment.MY_PREFS_NAME;

public class BaseFragment extends Fragment {
    private ImageButton eventPage;
    private ImageButton signOut;
    private ImageButton profileMenu;
    private ImageButton tradingEq;
    private TextView signOutText;
    private TextView profileText;
    private Fragment fragment;
    private boolean isLogged = true;
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_base, container, false);
        FragmentManager f = getChildFragmentManager();
        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment && isLogged) {
                    AlertDialog.Builder builder1 = new AlertDialog.Builder(getContext());
                    builder1.setMessage(R.string.log_out_warning);
                    builder1.setCancelable(true);

                    builder1.setPositiveButton(
                            "Yes",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.cancel();
                                    signOut();
                                }
                            });

                    builder1.setNegativeButton(
                            "No",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.cancel();
                                }
                            });

                    AlertDialog alert11 = builder1.create();
                    alert11.show();
                } else {
                    if (Navigation.findNavController(signOut).getCurrentDestination().getId() == R.id.baseFragment)
                        Navigation.findNavController(signOut).popBackStack();
                }
            }
        };
        requireActivity().getOnBackPressedDispatcher().addCallback(this, callback);
        fragment = f.findFragmentById(R.id.nav_host_base_fragment);
        eventPage = view.findViewById(R.id.menu_event);
        eventPage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment) {
                    RecyclerView recyclerView = fragment.getView().findViewById(R.id.recyclerView);
                    recyclerView.smoothScrollToPosition(0);
                } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventFragment) {
                    findNavController(fragment).popBackStack();
                } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.listCurrentFragment) {
                    findNavController(fragment).navigate(R.id.action_listCurrentFragment_to_eventListFragment);
                } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.profileFragment) {
                    findNavController(fragment).navigate(R.id.action_profileFragment_to_eventListFragment);
                }
            }
        });
        signOut = view.findViewById(R.id.menu_logout);
        signOutText = view.findViewById(R.id.base_signout_text);
        profileMenu = view.findViewById(R.id.menu_profile);
        profileText = view.findViewById(R.id.base_profile_text);
        tradingEq = view.findViewById(R.id.menu_trading_eq);
        final SharedPreferences prefs = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE);
        String email = prefs.getString("email", "default");
        if (GoogleSignIn.getLastSignedInAccount(getContext()) == null && email.equals("default")) {
            signOut.setVisibility(View.GONE);
            signOutText.setVisibility(View.GONE);
            profileMenu.setVisibility(View.GONE);
            profileText.setVisibility(View.GONE);
            isLogged = false;
        }
        signOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signOut();
            }
        });
        tradingEq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (findNavController(fragment).getCurrentDestination().getId() == R.id.listCurrentFragment) {
                    RecyclerView recyclerView = fragment.getView().findViewById(R.id.recyclerViewcurrent);
                    recyclerView.smoothScrollToPosition(0);
                } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment) {
                    findNavController(fragment).navigate(R.id.action_eventListFragment_to_listCurrentFragment);
                } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventFragment) {
                    findNavController(fragment).popBackStack();
                    findNavController(fragment).navigate(R.id.action_eventListFragment_to_listCurrentFragment);
                } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.profileFragment) {

                    findNavController(fragment).navigate(R.id.action_profileFragment_to_listCurrentFragment);
                }
            }
        });

        profileMenu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment) {
                   findNavController(fragment).navigate(R.id.action_eventListFragment_to_profileFragment);
                } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.listCurrentFragment) {
                    findNavController(fragment).navigate(R.id.action_listCurrentFragment_to_profileFragment);
                } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventFragment) {
                    findNavController(fragment).popBackStack();
                    findNavController(fragment).navigate(R.id.action_eventListFragment_to_profileFragment);
                }
            }
        });

        return view;
    }

    private void signOut() {
        MainActivity.getClient().signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                SharedPreferences.Editor editor = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).edit();
                editor.clear();
                editor.apply();
                if (Navigation.findNavController(signOut).getCurrentDestination().getId() == R.id.baseFragment)
                    Navigation.findNavController(signOut).popBackStack();

            }
        });
    }
}
