package com.example.arken.fragment;

import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

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
import com.example.arken.util.MenuAdapter;
import com.example.arken.util.OnMenuItemClickListener;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import static android.content.Context.MODE_PRIVATE;
import static androidx.navigation.fragment.NavHostFragment.findNavController;
import static com.example.arken.fragment.LoginFragment.MY_PREFS_NAME;

public class BaseFragment extends Fragment implements OnMenuItemClickListener {
    private Fragment fragment;
    private RecyclerView recyclerView;
    private int selected = 0;
    private boolean isLogged = true;
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_base, container, false);
        FragmentManager f = getChildFragmentManager();
        recyclerView = view.findViewById(R.id.menu_recycler);
        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                signOutPressed();
            }
        };
        requireActivity().getOnBackPressedDispatcher().addCallback(this, callback);
        fragment = f.findFragmentById(R.id.nav_host_base_fragment);

        final SharedPreferences prefs = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE);
        String email = prefs.getString("email", "default");
        if (GoogleSignIn.getLastSignedInAccount(getContext()) == null && email.equals("default")) {
            isLogged = false;
        }

        int[] imageArr = {R.drawable.ic_event, R.drawable.ic_trading_eq, R.drawable.ic_search, R.drawable.ic_person_white, R.drawable.ic_logout};
        String[] stringArr = {"Events", "Trading Eq","Search", "Profile", "Log Out"};
        MenuAdapter adapter = new MenuAdapter(imageArr, stringArr, isLogged, this);

        recyclerView.setAdapter(adapter);

        return view;
    }
    private void signOutPressed(){
        if ((findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment || selected == 4) && isLogged) {
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
            if (Navigation.findNavController(recyclerView).getCurrentDestination().getId() == R.id.baseFragment)
                Navigation.findNavController(recyclerView).popBackStack();
        }
    }

    private void signOut() {
        MainActivity.getClient().signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                SharedPreferences.Editor editor = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).edit();
                editor.clear();
                editor.apply();
                if (Navigation.findNavController(recyclerView).getCurrentDestination().getId() == R.id.baseFragment)
                    Navigation.findNavController(recyclerView).popBackStack();
            }
        });
    }

    @Override
    public void onMenuItemClicked(int index) {
        selected = index;
        if(index == 0){
            if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment) {
                RecyclerView recyclerView = fragment.getView().findViewById(R.id.recyclerView);
                recyclerView.smoothScrollToPosition(0);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventFragment) {
                findNavController(fragment).popBackStack();
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.listCurrentFragment) {
                findNavController(fragment).navigate(R.id.action_listCurrentFragment_to_eventListFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.profileFragment) {
                findNavController(fragment).navigate(R.id.action_profileFragment_to_eventListFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.searchFragment) {
                findNavController(fragment).popBackStack();
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.currencyFragment) {
                findNavController(fragment).popBackStack();
                findNavController(fragment).navigate(R.id.action_listCurrentFragment_to_eventListFragment);
            }
        }
        else if(index == 1){
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
            else if (findNavController(fragment).getCurrentDestination().getId() == R.id.searchFragment) {
                findNavController(fragment).navigate(R.id.action_searchFragment_to_listCurrentFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.currencyFragment) {
                findNavController(fragment).popBackStack();
            }
        }
        else if(index == 2){
            if (findNavController(fragment).getCurrentDestination().getId() == R.id.listCurrentFragment) {
//                RecyclerView recyclerView = fragment.getView().findViewById(R.id.rec);
//                recyclerView.smoothScrollToPosition(0);
                findNavController(fragment).navigate(R.id.action_listCurrentFragment_to_searchFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment) {
                findNavController(fragment).navigate(R.id.action_eventListFragment_to_searchFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventFragment) {
                findNavController(fragment).popBackStack();
                findNavController(fragment).navigate(R.id.action_eventListFragment_to_searchFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.profileFragment) {
                findNavController(fragment).navigate(R.id.action_profileFragment_to_searchFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.currencyFragment) {
                findNavController(fragment).popBackStack();
                findNavController(fragment).navigate(R.id.action_listCurrentFragment_to_searchFragment);
            }
        }
        else if (index == 3){
            if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment) {
                findNavController(fragment).navigate(R.id.action_eventListFragment_to_profileFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.listCurrentFragment) {
                findNavController(fragment).navigate(R.id.action_listCurrentFragment_to_profileFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.eventFragment) {
                findNavController(fragment).popBackStack();
                findNavController(fragment).navigate(R.id.action_eventListFragment_to_profileFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.searchFragment) {
                findNavController(fragment).navigate(R.id.action_searchFragment_to_profileFragment);
            } else if (findNavController(fragment).getCurrentDestination().getId() == R.id.currencyFragment) {
                findNavController(fragment).popBackStack();
                findNavController(fragment).navigate(R.id.action_listCurrentFragment_to_profileFragment);
            }
        }
        else if (index == 4){
            signOutPressed();
        }

    }
}
